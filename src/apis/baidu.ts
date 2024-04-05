import axios from "axios";
import md5 from "@/utils/md5";

const encryption = (q: string, salt: string | number) => {
  const str1 = `${import.meta.env.VITE_BAIDU_APPID}${q}${salt}${
    import.meta.env.VITE_BAIDU_SECRET
  }`;
  return md5(str1);
};

export default (text: string, to = "zh", from = "auto") => {
  const salt = new Date().getTime();
  const q = encodeURI(text);
  return axios
    .get(
      `/baidu/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${
        import.meta.env.VITE_BAIDU_APPID
      }&salt=${salt}&sign=${encryption(text, salt)}`
    )
    .then((res) => {
      const {
        status,
        statusText,
        data: { trans_result },
      } = res;
      if (status === 200 && statusText === "OK") {
        return trans_result[0].dst;
      }
      return "";
    });
};
