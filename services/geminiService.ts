
import { GoogleGenAI, Type } from "@google/genai";
import { AuthDetails, Verdict } from "../types";

const FRAGRANCE_CATALOG = [
  "Dior Sauvage", "Chanel Bleu de Chanel", "Creed Aventus", "Versace Eros", "YSL Y", "Tom Ford", 
  "Giorgio Armani Acqua di Giò", "Paco Rabanne 1 Million", "Jean Paul Gaultier Le Male", 
  "Azzaro The Most Wanted", "Hermes Terre d'Hermès", "Viktor & Rolf Spicebomb", "Montblanc Explorer", 
  "Paco Rabanne Invictus", "Montblanc Legend", "Carolina Herrera Bad Boy", "Dolce & Gabbana Light Blue", 
  "Ralph Lauren Polo", "Hugo Boss Bottled", "Parfums de Marly Layton", "Louis Vuitton", 
  "Givenchy Gentleman", "Gucci Guilty", "Prada L’Homme", "Roja Dove", "Initio Oud for Greatness", 
  "Narciso Rodriguez For Him", "Dolce & Gabbana The One", "Maison Margiela Replica Jazz Club", 
  "Armani Code", "Dior Homme", "YSL La Nuit de l’Homme", "Acqua di Parma Colonia", 
  "Jo Malone London", "Issey Miyake L’Eau d’Issey", "Le Labo Santal 33", "Bvlgari Man in Black", 
  "Lattafa Khamrah", "Armaf Club de Nuit", "Rasasi Hawas", "Amouage Reflection Man", 
  "Nishane Hacivat", "Xerjoff", "Kilian Angels' Share", "Byredo Mojave Ghost", 
  "Chanel Allure Homme Sport", "Versace Dylan Blue", "Calvin Klein Eternity", "Nautica Voyage",
  "Bentley for Men"
];

const FLANKER_CATALOG: Record<string, string[]> = {
  "Dior Sauvage": ["Sauvage Eau de Toilette", "Sauvage Parfum", "Sauvage Elixir", "Sauvage Eau de Parfum"],
  "Chanel Bleu de Chanel": ["Bleu de Chanel Eau de Toilette", "Bleu de Chanel Parfum", "Bleu de Chanel Eau de Parfum"],
  "Creed Aventus": ["Aventus", "Aventus Cologne", "Silver Mountain Water"],
  "Versace Eros": ["Eros Eau de Toilette", "Eros Flame", "Eros Parfum"],
  "YSL Y": ["Y Eau de Toilette", "Y Eau de Parfum", "Y Le Parfum"],
  "Tom Ford": ["Tobacco Vanille", "Oud Wood", "Noir Extreme", "Fucking Fabulous", "Lost Cherry", "Ombré Leather", "Tuscan Leather"],
  "Giorgio Armani Acqua di Giò": ["Acqua di Giò Profondo", "Acqua di Giò Parfum", "Acqua di Giò Profumo"],
  "Paco Rabanne 1 Million": ["1 Million Eau de Toilette", "1 Million Parfum", "1 Million Elixir"],
  "Jean Paul Gaultier Le Male": ["Le Male Eau de Toilette", "Ultra Male", "Le Male Le Parfum", "Le Male Elixir", "Le Beau", "Scandal Pour Homme", "Le Male Lover"],
  "Azzaro The Most Wanted": ["The Most Wanted Parfum", "The Most Wanted Eau de Toilette Intense"],
  "Hermes Terre d'Hermès": ["Terre d'Hermès Eau de Toilette", "Terre d'Hermès Parfum", "Terre d'Hermès Eau Très Fraîche"],
  "Viktor & Rolf Spicebomb": ["Spicebomb Extreme", "Spicebomb Infrared", "Spicebomb Night Vision"],
  "Montblanc Explorer": ["Explorer", "Explorer Ultra Blue"],
  "Paco Rabanne Invictus": ["Invictus Victory", "Invictus Legend", "Invictus Platinum"],
  "Montblanc Legend": ["Legend Eau de Toilette", "Legend Spirit", "Legend Night"],
  "Carolina Herrera Bad Boy": ["Bad Boy Eau de Toilette", "Bad Boy Le Parfum"],
  "Dolce & Gabbana Light Blue": ["Light Blue Eau Intense", "Light Blue Forever"],
  "Ralph Lauren Polo": ["Polo Blue", "Polo Red", "Polo Black"],
  "Hugo Boss Bottled": ["Boss Bottled Parfum", "Boss Bottled Elixir", "Boss Bottled Intense"],
  "Parfums de Marly Layton": ["Layton", "Layton Exclusif", "Pegasus", "Herod"],
  "Louis Vuitton": ["Imagination", "L'Immensité", "Ombré Nomade", "Afternoon Swim", "Météore", "Nouveau Monde", "Pacific Chill"],
  "Givenchy Gentleman": ["Gentleman Eau de Parfum", "Gentleman Society", "Gentleman Reserve Privée"],
  "Gucci Guilty": ["Guilty Pour Homme Eau de Parfum", "Guilty Pour Homme Parfum"],
  "Prada L’Homme": ["L’Homme Prada", "Luna Rossa Ocean"],
  "Roja Dove": ["Elysium", "Apex"],
  "Initio Oud for Greatness": ["Oud for Greatness", "Side Effect"],
  "Narciso Rodriguez For Him": ["For Him Bleu Noir Eau de Toilette", "For Him Bleu Noir Parfum"],
  "Dolce & Gabbana The One": ["The One Eau de Parfum", "The One Mysterious Night"],
  "Maison Margiela Replica Jazz Club": ["Jazz Club"],
  "Armani Code": ["Code Parfum", "Code Eau de Toilette"],
  "Dior Homme": ["Dior Homme Intense", "Dior Homme Parfum"],
  "YSL La Nuit de l’Homme": ["La Nuit de l’Homme Eau de Toilette", "La Nuit de l’Homme Le Parfum"],
  "Acqua di Parma Colonia": ["Colonia", "Colonia Essenza"],
  "Jo Malone London": ["Myrrh & Tonka", "Oud & Bergamot"],
  "Issey Miyake L’Eau d’Issey": ["L’Eau d’Issey Pour Homme", "L’Eau d’Issey Intense"],
  "Le Labo Santal 33": ["Santal 33"],
  "Bvlgari Man in Black": ["Man in Black", "Tygar"],
  "Lattafa Khamrah": ["Khamrah"],
  "Armaf Club de Nuit": ["Club de Nuit Intense Man", "Club de Nuit Milestone"],
  "Rasasi Hawas": ["Hawas"],
  "Amouage Reflection Man": ["Reflection Man"],
  "Nishane Hacivat": ["Hacivat"],
  "Xerjoff": ["Naxos", "Erba Pura", "Alexandria II"],
  "Kilian Angels' Share": ["Angels' Share"],
  "Byredo Mojave Ghost": ["Mojave Ghost"],
  "Chanel Allure Homme Sport": ["Allure Homme Sport Eau Extrême"],
  "Versace Dylan Blue": ["Dylan Blue"],
  "Calvin Klein Eternity": ["Eternity for Men Parfum"],
  "Nautica Voyage": ["Voyage"],
  "Bentley for Men": ["Bentley for Men Intense"]
};

const resizeImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const getSuggestions = async (type: 'collection' | 'specificType', context: { collection?: string, query: string }): Promise<string[]> => {
  const query = context.query.toLowerCase().trim();

  if (type === 'collection') {
    if (!query) return [];
    return FRAGRANCE_CATALOG
      .filter(item => item.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 10);
  }

  if (type === 'specificType' && context.collection) {
    const localVersions = FLANKER_CATALOG[context.collection];
    if (localVersions) {
      if (!query) return localVersions;
      return localVersions
        .filter(v => v.toLowerCase().includes(query))
        .sort((a, b) => a.localeCompare(b));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `List the official specific types, concentrations, and flankers for the fragrance "${context.collection}" ${context.query ? `matching "${context.query}"` : ''}. 
      RULES:
      - Return ONLY the unique identifier.
      - DO NOT include the words "${context.collection}".
      - Return a JSON array of strings.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Suggestion error:", e);
      return ["Eau de Toilette", "Eau de Parfum", "Parfum", "Intense"];
    }
  }

  return [];
};

export const performAuthentication = async (files: File[], userContext: string): Promise<{ name: string; details: AuthDetails; searchQuery: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts = [];
  for (const file of files) {
    const base64 = await resizeImage(file);
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64 } });
  }

  const prompt = `
    You are a Master Fragrance Authenticator for 'Check Cologne AI'. 
    TASK: Authenticate the fragrance in the provided images based on the user's specific input.
    
    USER PROVIDED CONTEXT:
    ${userContext}
    
    INSTRUCTIONS:
    - Compare the visual evidence against the known characteristics of the specific brand/collection/type provided.
    - Provide a definitive AUTHENTIC or REPLICA verdict.
    - Return a detailed reasoning string.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 15000 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            model: { type: Type.STRING },
            collection: { type: Type.STRING },
            specificType: { type: Type.STRING },
            concentration: { type: Type.STRING },
            volume: { type: Type.STRING },
            verdict: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            analysisPoints: {
              type: Type.OBJECT,
              properties: {
                atomizer: { type: Type.STRING },
                glassQuality: { type: Type.STRING },
                packaging: { type: Type.STRING }
              }
            },
            batchCodeValue: { type: Type.STRING },
            searchQuery: { type: Type.STRING }
          },
          required: ["name", "brand", "model", "verdict", "confidence", "reasoning", "searchQuery"]
        }
      },
    });

    if (!response.text) throw new Error("Empty response from AI");
    const data = JSON.parse(response.text);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Search Reference",
      uri: chunk.web?.uri || ""
    })).filter((s: any) => s.uri) || [];

    let normalizedVerdict: Verdict = 'AUTHENTIC';
    const v = data.verdict?.toUpperCase() || '';
    if (v.includes('REPLICA') || v.includes('FAKE')) {
        normalizedVerdict = 'REPLICA';
    } else if (v.includes('INCONCLUSIVE')) {
        normalizedVerdict = 'INCONCLUSIVE';
    }

    return {
      name: data.name || data.model || "Unknown Cologne",
      searchQuery: data.searchQuery || data.name,
      details: {
        brand: data.brand || "Unknown",
        model: data.model || data.name || "Unknown",
        collection: data.collection || "",
        specificType: data.specificType || "",
        concentration: data.concentration || "EDP",
        volume: data.volume || "100ml",
        verdict: normalizedVerdict,
        confidence: Math.round(data.confidence > 1 ? data.confidence : data.confidence * 100) || 50,
        reasoning: data.reasoning || "Authentication logic executed.",
        analysisPoints: data.analysisPoints || { atomizer: 'PASS', glassQuality: 'PASS', packaging: 'PASS' },
        batchCodeValue: data.batchCodeValue || "",
        sources: sources
      }
    };
  } catch (error) {
    console.error("Authentication Error:", error);
    throw error;
  }
};
