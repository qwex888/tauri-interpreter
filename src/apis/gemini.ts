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
                text: "我希望你充当语言检测器。我会用任何语言输入一个句子，你会回答我，我写的句子在你是用哪种语言写的。不要写任何解释或其他文字，只需回复语言名称即可。我的第一句话是：",
              },
              {
                text,
              },
            ],
          },
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
      if (status === 200) {
        data.forEach((i: { candidates: any[] }) => {
          i.candidates.forEach((s: { content: any[] }) => {
            s.content.forEach((y: { parts: any[] }) => {
              y.parts.forEach((z: { text: any }) => {
                fullText += `${z.text}; `;
              });
            });
          });
        });
      }
      return fullText;
    });
};
