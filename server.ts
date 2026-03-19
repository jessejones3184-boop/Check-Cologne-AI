import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory user store (Reset on server restart)
// In production, use a database like MongoDB or PostgreSQL
const users = new Map<string, any>();
const processedSessions = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Stripe Secret Key is missing. Please set STRIPE_SECRET_KEY in the Settings menu.");
    }
    return new Stripe(key, {
      apiVersion: "2024-12-18.acacia" as any,
    });
  };

  app.use(express.json());
  app.use(cookieParser("genify-secret")); // Use a secret for signed cookies

  // --- Auth Middleware ---
  const getOrCreateUser = (req: express.Request, res: express.Response) => {
    let userId = req.signedCookies.userId;
    let user = userId ? users.get(userId) : null;

    if (!user) {
      userId = uuidv4();
      user = {
        id: userId,
        name: "Guest User",
        email: "", // Will be filled by Stripe or left empty
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        scansRemaining: 1, // Start with 1 free scan
        isSubscribed: false,
      };
      users.set(userId, user);

      res.cookie("userId", userId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }
    return user;
  };

  // --- API Routes ---

  // Get current user (Auto-creates if not exists)
  app.get("/api/auth/me", (req, res) => {
    const user = getOrCreateUser(req, res);
    res.json({ user });
  });

  // Check configuration status (for debugging)
  app.get("/api/config/status", (req, res) => {
    res.json({
      stripe: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      },
      appUrl: !!process.env.APP_URL,
    });
  });

  // Stripe: Create Checkout Session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const user = getOrCreateUser(req, res);

    const { priceType } = req.body; // 'single' or 'monthly'
    const priceId = priceType === 'monthly' ? process.env.STRIPE_PRICE_ID_MONTHLY : process.env.STRIPE_PRICE_ID_SINGLE;

    try {
      const stripe = getStripe();
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      
      const lineItem: any = priceId 
        ? { price: priceId, quantity: 1 }
        : {
            price_data: {
              currency: 'usd',
              product_data: {
                name: priceType === 'monthly' ? 'Genify Unlimited Pro' : 'Genify Single Scan',
                description: priceType === 'monthly' ? 'Unlimited AI Authentication scans for 1 month' : '1 high-precision AI Authentication scan',
              },
              unit_amount: priceType === 'monthly' ? 799 : 299,
              recurring: priceType === 'monthly' ? { interval: 'month' } : undefined,
            },
            quantity: 1,
          };

      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: [lineItem],
        mode: priceType === 'monthly' ? "subscription" : "payment",
        success_url: `${appUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/?payment=cancel`,
        metadata: {
          userId: user.id,
          priceType,
        },
      };

      if (user.email) {
        sessionOptions.customer_email = user.email;
      }

      const session = await stripe.checkout.sessions.create(sessionOptions);

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // API to verify Stripe session (fallback for when webhooks are not configured)
  app.post("/api/stripe/verify-session", async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.signedCookies.userId;
    const user = userId ? users.get(userId) : null;

    if (!user || !sessionId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid" && session.metadata?.userId === userId) {
        // Check if we've already processed this session to avoid double crediting
        // In a real app, you'd store session IDs in a database
        const priceType = session.metadata?.priceType;
        
        // Simple idempotency check using a temporary set (cleared on restart)
        if (!processedSessions.has(sessionId)) {
          if (priceType === 'monthly') {
            user.isSubscribed = true;
          } else {
            user.scansRemaining += 1;
          }
          users.set(userId, user);
          processedSessions.add(sessionId);
          return res.json({ success: true, user });
        }
        return res.json({ success: true, message: "Already processed", user });
      }
      res.status(400).json({ error: "Session not paid" });
    } catch (error: any) {
      console.error("Verification Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET not configured. Webhook ignored.");
      return res.status(200).send("Webhook secret not configured");
    }

    let event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const priceType = session.metadata?.priceType;

      if (userId) {
        const user = users.get(userId);
        if (user) {
          if (priceType === 'monthly') {
            user.isSubscribed = true;
          } else {
            user.scansRemaining += 1;
          }
          users.set(userId, user);
        }
      }
    }

    res.json({ received: true });
  });

  // API to decrement scan count
  app.post("/api/user/use-scan", (req, res) => {
    const userId = req.signedCookies.userId;
    const user = userId ? users.get(userId) : null;
    
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (user.isSubscribed) {
      return res.json({ success: true, remaining: "unlimited" });
    }

    if (user.scansRemaining > 0) {
      user.scansRemaining -= 1;
      users.set(user.id, user);
      return res.json({ success: true, remaining: user.scansRemaining });
    }

    res.status(403).json({ error: "No scans remaining" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
