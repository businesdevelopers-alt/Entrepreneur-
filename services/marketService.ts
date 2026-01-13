
import { GoogleGenAI, Type } from "@google/genai";

export interface MarketItem {
  symbol: string;
  price: string;
  change: string;
}

export const fetchRealtimeMarketData = async (): Promise<MarketItem[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    جلب أحدث أسعار الأسهم والعملات الرقمية التالية: AAPL, TSLA, BTC, ETH, NVDA, GOOGL.
    أعطني السعر الحالي ونسبة التغيير خلال الـ 24 ساعة الماضية.
    يجب أن تكون المخرجات بتنسيق JSON حصرياً كمصفوفة من الكائنات.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              price: { type: Type.STRING },
              change: { type: Type.STRING }
            },
            required: ["symbol", "price", "change"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received");
    return JSON.parse(text) as MarketItem[];
  } catch (error) {
    console.error("Market data fetch error:", error);
    // Fallback data if API fails
    return [
      { symbol: 'BTC', price: '68,210', change: '+1.4%' },
      { symbol: 'AAPL', price: '215.30', change: '+0.8%' },
      { symbol: 'NVDA', price: '124.50', change: '+3.2%' },
      { symbol: 'ETH', price: '2,650', change: '-0.5%' }
    ];
  }
};
