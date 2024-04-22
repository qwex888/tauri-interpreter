import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
        appSetting: {
            isUseNextWebApi: false,
            nextWebUrl: '',
            nextWebPassword: '',
            openAiKey: '',
            geminiKey: '',
            isUseCustomBaidu: false,
            baiduAppId: '',
            baiiduSecret: ''
        },
        theme: '',
        modelType: 'baidu'
    }
  },
  getters: {
    getBaseUrl(state) {
      return state.appSetting.isUseNextWebApi ? state.appSetting.nextWebUrl : ''
    },
    getModel(state) {
      return state.modelType
    }
  },
  actions: {
    initApp () {
      this.initTheme()
    },
    initTheme() {
      const {theme} = this
      if (theme === 'dark' || window.matchMedia("(prefers-color-scheme: dark)").matches) {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }
      this.contorlThemeDom()
    },
    setTheme() {
      this.theme =  this.theme === 'dark' ? 'light' : 'dark'
      this.contorlThemeDom()
    },
    setModel(type: string) {
      this.modelType = type
    },
    contorlThemeDom() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['appSetting', 'theme', 'modelType'],
  }
})