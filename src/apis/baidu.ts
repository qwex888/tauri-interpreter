import axios from "axios";
// APPID(appid)， 翻译 query(q，注意为UTF-8编码)，随机数(salt)，以及平台分配的密钥(可在管理控制台查看) 按照 appid+q+salt+密钥的顺序拼接得到字符串 1
const encryption = (q: string) => {
    const salt = (new Date).getTime();
    const str1 = `${import.meta.env.VITE_BAIDU_APPID}${q}${salt}${import.meta.env.VITE_BAIDU_SECRET}`
}

export default (text: string) => {
    return axios.post(`https://fanyi-api.baidu.com/api/trans/vip/translate`)
}