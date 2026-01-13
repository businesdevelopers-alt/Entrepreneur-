
import { GoogleGenAI, Type } from "@google/genai";
import { BriefingResponse } from "../types";

export const generateSmartBriefing = async (topic: string): Promise<BriefingResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    أنت محلل استراتيجي خبير في صحيفة "Entrepreneur NASHRA". 
    قم بتحليل الموضوع التالي بعمق: "${topic}".
    ركز على الجوانب التقنية والاقتصادية والفرص المستقبلية لرواد الأعمال.
    يجب أن يكون الرد باللغة العربية الفصحى الرصينة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "عنوان جذاب للتقرير" },
            summary: { type: Type.STRING, description: "ملخص تنفيذي شامل" },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "أهم النقاط والتحليلات"
            },
            outlook: { type: Type.STRING, description: "توقعات مستقبلية مختصرة" }
          },
          required: ["title", "summary", "keyPoints", "outlook"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام رد من المحلل الذكي");
    return JSON.parse(text) as BriefingResponse;
  } catch (error) {
    console.error("Briefing error:", error);
    throw new Error("حدث خطأ أثناء الاتصال بالمحلل الذكي. يرجى المحاولة لاحقاً.");
  }
};

export const summarizeArticle = async (title: string, content: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    قم بتلخيص المقال التالي بأسلوب نقاط ذكية (Bullet points) بحد أقصى 3 نقاط.
    اجعل الملخص موجهاً لرجال الأعمال والتقنيين المشغولين.
    عنوان المقال: "${title}"
    المحتوى: "${content.substring(0, 3000)}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "فشل توليد الملخص.";
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("عذراً، فشل توليد الملخص الذكي.");
  }
};
