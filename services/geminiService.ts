
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Robust JSON extraction with thinking-tag stripping and markdown cleaning.
 */
function extractJson(text: string) {
  try {
    // 1. Remove thinking tags
    const thinkingRemoved = text.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
    // 2. Extract JSON from markdown or raw text
    const jsonMatch = thinkingRemoved.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : thinkingRemoved;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Forensic Engine Output Parse Error:", text);
    throw new Error("STABILITY HALT: The Neural Engine returned an unstable data structure. Please ensure lighting is consistent and retry.");
  }
}

/**
 * Local Forensic Compression: Optimizes images to 1200px (Gemini Sweet Spot) 
 * to ensure fast uploads and prevent API timeout crashes.
 */
async function optimizeForensicImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX_DIM) { h *= MAX_DIM / w; w = MAX_DIM; } }
        else { if (h > MAX_DIM) { w *= MAX_DIM / h; h = MAX_DIM; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * CRASH-RESISTANT FORENSIC ENGINE
 * Model: gemini-3-flash-preview (Stability Choice)
 */
export async function performAuthentication(files: File[], context: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const imageParts = await Promise.all(files.map(async (f) => ({
    inlineData: { mimeType: 'image/jpeg', data: await optimizeForensicImage(f) }
  })));

  const systemInstruction = `EMERGENCY STABILITY MODE ACTIVATED. 
You are a crash-proof Forensic Analyst. Your #1 priority is: NEVER crash. 
NEVER use more than 1500 tokens total output.

PROCESS:
1. Short analysis in <thinking> tags (max 6 points).
2. Output ONLY valid JSON. No chit-chat.

RULES:
• Max 400 words total.
• Use short sentences.
• If data is blurry/missing → "Missing / Unclear".
• Analysis categories: Branding & Logos, Material Quality, Batch/Serial Codes, Packaging & Labels.`;

  const prompt = `Analyze these item images very concisely and safely:
Context: ${context}

Output EXACTLY this JSON structure:
{
  "name": "Full product name",
  "details": {
    "itemName": "Full item name provided",
    "verdict": "AUTHENTIC / REPLICA / INCONCLUSIVE",
    "confidence": 0-100,
    "reasoning": "Brief expert findings (max 20 words)",
    "analysisPoints": {
      "branding": "PASS / FAIL / FLAGGED",
      "buildQuality": "PASS / FAIL / FLAGGED",
      "packaging": "PASS / FAIL / FLAGGED"
    },
    "batchCodeValue": "Found code",
    "sources": [{"title": "Source Name", "uri": "Link"}]
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [...imageParts, { text: prompt }] }],
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 512 }, // Budgeted for stable reasoning
        responseMimeType: "application/json",
      },
    });

    if (!response.text) throw new Error("Null engine response.");
    return extractJson(response.text);
  } catch (error: any) {
    console.error("Forensic Hub Exception:", error);
    throw error;
  }
}
