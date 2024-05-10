import axios from "axios";
import { useAppStore } from "@/stores/app";

export default (text: string) => {
  const appStore = useAppStore();
  const baseUrl = appStore.getBaseUrl();
  let apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers: any = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  };
  if (baseUrl) {
    apiUrl = `${baseUrl}/api/openai/v1/chat/completions`;
  }
  return axios
    .post(
      apiUrl,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一个语言翻译助手，拥有多语言识别和翻译能力。你的任务是根据用户输入的文本和目标语言进行翻译，确保翻译结果自然通顺，结构严谨。如果没有指定则把英语翻译为中文，中文翻译为英文。你需要支持多种语言的翻译。请直接输出目标语言的翻译内容。对话风格应该友好、专业，输出格式应当清晰易懂，避免歧义。我的第一句话是："
          },
          {
            role: 'user',
            content: text
          }
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
        data.choices.forEach((i: { message: any }) => {
          fullText += i.message.content
        });
      }
      return fullText;
    });
};
