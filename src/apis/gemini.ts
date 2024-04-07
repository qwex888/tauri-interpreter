import axios from "axios";

export default (text: string) => {
  return axios
    .post(
      `${import.meta.env.VITE_GEMINI_BASE_URL}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "我希望你充当语言翻译官。我会用任何语言输入一个句子，你会帮我翻译。如果是英语则翻译为中文，如果是中文则翻译为英语,我的第一句话是：",
              },
              {
                text
              }
            ],
          },
          // {
          //   role: "user",
          //   parts: [{ text }],
          // },
        ],
        generationConfig: {
          temperature: 1,
          maxOutputTokens: 2000,
          topP: 1,
        },
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
          Authorization: "Bearer nk-mm2395695",
        },
      }
    )
    .then((res) => {
      const { status, data } = res;
      let fullText: string = "";
      console.log(res, 'res');
      if (status === 200) {
        data.forEach((i: { candidates: any[] }) => {
          i.candidates.forEach((s: { content: any }) => {
            s.content.parts.forEach((part: any) => {
                fullText += `${part.text}`;
            });
          });
        });
      }
      return fullText;
    });
};
