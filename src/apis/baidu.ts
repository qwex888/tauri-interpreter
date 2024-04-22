import axios from "axios";
import md5 from "@/utils/md5";
import { useAppStore } from "@/stores/app";

const getBaiduKey = () => {
  const appStore = useAppStore();
  return {
    appId: appStore.appSetting.isUseCustomBaidu
      ? appStore.appSetting.baiduAppId
      : import.meta.env.VITE_BAIDU_APPID,
    secret: appStore.appSetting.isUseCustomBaidu
      ? appStore.appSetting.baiiduSecret
      : import.meta.env.VITE_BAIDU_SECRET,
  };
};

const encryption = (q: string, salt: string | number) => {
  const { appId, secret } = getBaiduKey();
  const str1 = `${appId}${q}${salt}${secret}`;
  return md5(str1);
};

export default (text: string, to = "zh", from = "auto") => {
  if (/[\u4e00-\u9fa5]+/.test(text)) {
    to = "en";
  }
  const salt = new Date().getTime();
  const q = encodeURI(text);
  const { appId } = getBaiduKey();
  return axios
    .get(
      `/baidu/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appId}&salt=${salt}&sign=${encryption(
        text,
        salt
      )}`
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
