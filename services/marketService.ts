
import { GoogleGenAI, Type } from "@google/genai";

export interface MarketItem {
  symbol: string;
  price: string;
  change: string;
}

const FALLBACK_DATA: MarketItem[] = [
  { symbol: 'BTC', price: '68,210', change: '+1.4%' },
  { symbol: 'AAPL', price: '215.30', change: '+0.8%' },
  { symbol: 'NVDA', price: '124.50', change: '+3.2%' },
  { symbol: 'ETH', price: '2,650', change: '-0.5%' }
];

export const fetchRealtimeMarketData = async (): Promise<MarketItem[]> => {
  // استخدام الترويسة لضمان وجود المفتاح
  const apiKey = process.env.API_KEY;
  if (!apiKey) return FALLBACK_DATA;

  const ai = new GoogleGenAI({ apiKey });

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
    if (!text) return FALLBACK_DATA;
    return JSON.parse(text) as MarketItem[];
  } catch (error) {
    console.warn("Market data fetch failed, using fallback:", error);
    return FALLBACK_DATA;
  }
};
