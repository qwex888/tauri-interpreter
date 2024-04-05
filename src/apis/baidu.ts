import axios from "axios";
import md5 from '@/utils/md5'

const encryption = (q: string, salt: string|number) => {
    const str1 = `${import.meta.env.VITE_BAIDU_APPID}${q}${salt}${import.meta.env.VITE_BAIDU_SECRET}`
    return md5(str1)
}

export default (text: string, to = 'zh', from = 'en') => {
    const salt = (new Date).getTime();
    const q = encodeURI(text);
    return axios.post(`https://fanyi-api.baidu.com/api/trans/vip/translate`, {
        q,
        to,
        from,
        salt,
        appid: import.meta.env.VITE_BAIDU_APPID,
        sign: encryption(q, salt)
    })
}