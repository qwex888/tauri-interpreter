import axios from "axios";
import { useAppStore } from "@/stores/app";

export default (text: string) => {
  const appStore = useAppStore();
  const baseUrl = appStore.getBaseUrl();
  const apiUrl =
    (baseUrl
      ? `${baseUrl}/api/${appStore.modelType}`
      : import.meta.env.VITE_GEMINI_BASE_URL) +
    "/v1beta/models/gemini-pro:generateContent";
  return axios
    .post(
      `${apiUrl}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "我希望你充当语言翻译官。我会用任何语言输入一个句子，你会帮我翻译。如果是除中文以外的语言都翻译为中文，如果是中文且不指定翻译语种则一律翻译为英语,我的第一句话是：",
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer nk-${appStore.appSetting.nextWebPassword}`
        },
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
