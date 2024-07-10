import axios from "axios";
import http from './http';
import md5 from "@/utils/md5";
import { handleIsTauri } from '@/utils/index';
import { useAppStore } from "@/stores/app";

const getBaiduKey = () => {
  const appStore = useAppStore();
  return appStore.getBaiduKey()
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
  let response = handleIsTauri() ? http(`https://fanyi-api.baidu.com/api/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appId}&salt=${salt}&sign=${encryption(
      text,
      salt
    )}`, {
    method: 'get'
    }) :
    axios.get(
      `/baidu/trans/vip/translate?q=${q}&from=${from}&to=${to}&appid=${appId}&salt=${salt}&sign=${encryption(
        text,
        salt
      )}`
    );
  return response.then((res) => {
    const {
      status,
      data: { trans_result },
    } = res;
    if (status === 200) {
      return trans_result[0].dst;
    }
    return "";
  });
};
