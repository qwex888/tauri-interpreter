import { fetch } from '@tauri-apps/api/http'


const baseURL = ``
 
const BODY_TYPE = {
    Form: 'Form',
    Json: 'Json',
    Text: 'Text',
    Bytes: 'Bytes',
}
 
const commonOptions = {
    timeout: 60,
}
 
const isAbsoluteURL = (url: string): boolean => {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}
 
const combineURLs = (baseURL: string, relativeURL: string): string => {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
}
 
const buildFullPath = (baseURL: string, requestedURL: string) => {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL)
    }
    return requestedURL
}
 
const http = (url: string, options: any = {}) => {
    if (!options.headers) options.headers = {}
    if (options?.body) {
        if (options.body.type === BODY_TYPE.Form) {
            options.headers['Content-Type'] = 'multipart/form-data'
        }
    }
 
    options = { ...commonOptions, ...options }
    return fetch(buildFullPath(baseURL, url), options)
        .then((res) => {
            if (res.status >= 200 && res.status < 400) {
                return res
            }
            return Promise.reject(res)
        })
        .catch((err) => {
            console.error(err)
            return Promise.reject(err)
        })
}
export default http