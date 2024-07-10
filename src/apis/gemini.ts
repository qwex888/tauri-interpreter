import axios from "axios";
import { useAppStore } from "@/stores/app";

export default (text: string) => {
  const appStore = useAppStore();
  const baseUrl = appStore.getBaseUrl();
  let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
    import.meta.env.VITE_GEMINI_API_KEY
  }`;
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (baseUrl) {
    apiUrl = `${baseUrl}/api/google/v1beta/models/gemini-pro:generateContent`;
    headers[
      "Authorization"
    ] = `Bearer nk-${appStore.appSetting.nextWebPassword}`;
  }

  return axios
    .post(
      apiUrl,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "你是一个语言翻译助手，拥有多语言识别和翻译能力。你的任务是根据用户输入的文本和目标语言进行翻译，确保翻译结果自然通顺，结构严谨。如果没有指定则把英语翻译为中文，中文翻译为英文。你需要支持多种语言的翻译。请直接输出目标语言的翻译内容。对话风格应该友好、专业，输出格式应当清晰易懂，避免歧义。我的第一句话是：",
              },
              {
                text,
              },
            ],
          },
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
        ],
      },
      {
        headers,
      }
    )
    .then((res) => {
      const { status, data } = res;
      let fullText: string = "";
      if (status === 200) {
        data.candidates.forEach((i: { content: any }) => {
          i.content.parts.forEach((part: any) => {
            fullText += `${part.text}`;
          });
        });
      }
      return fullText;
    });
};
