import { defineStore } from "pinia";
import { isRegistered, register } from '@tauri-apps/api/globalShortcut';
import { invoke } from "@tauri-apps/api/tauri";
import { show } from '@tauri-apps/api/app';

import {
  BAIDU_OPTION,
  GEMINI_OPTION,
  OPENAI_OPTION,
} from "@/constants/index";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      appSetting: {
        isUseNextWebApi: false,
        nextWebUrl: "",
        nextWebPassword: "",
        isUseCustomBaidu: false,
        baiduAppId: "",
        baiiduSecret: "",
        isUseCustomGeminiApi: false,
        geminiKey: "",
        isUseCustomOpenAiApi: false,
        openAiKey: "",
        // globalShowWindow: 'alt+f'
        globalShowWindow: 'CmdOrControl+f'
      },
      theme: "",
      modelType: "baidu",
      showSetting: false
    };
  },
  getters: {

  },
  actions: {
    getBaseUrl() {
      return this.appSetting.isUseNextWebApi
        ? this.appSetting.nextWebUrl
        : "";
    },
    getBaiduKey() {
      let appId = import.meta.env.VITE_BAIDU_APPID;
      let secret = import.meta.env.VITE_BAIDU_SECRET;
      if (
        this.appSetting.isUseCustomBaidu &&
        this.appSetting.baiduAppId &&
        this.appSetting.baiiduSecret
      ) {
        appId = this.appSetting.baiduAppId;
        secret = this.appSetting.baiiduSecret;
      }
      return {
        appId,
        secret,
      };
    },
    getGeminiKey() {
      let key = import.meta.env.VITE_GEMINI_API_KEY;
      if (
        this.appSetting.isUseCustomGeminiApi &&
        this.appSetting.geminiKey
      ) {
        key = this.appSetting.geminiKey;
      }
      return key
    },
    getOpenAiKey() {
      let key = import.meta.env.VITE_OPENAI_API_KEY;
      if (
        this.appSetting.isUseCustomOpenAiApi &&
        this.appSetting.openAiKey
      ) {
        key = this.appSetting.openAiKey;
      }
      return key
    },
    checkApi() {
      const { modelType } = this;
      switch (modelType) {
        case BAIDU_OPTION:
          const { appId, secret } = this.getBaiduKey();
          return appId && secret;
        case GEMINI_OPTION:
          return !!this.getGeminiKey();
        case OPENAI_OPTION:
          return !!this.getOpenAiKey();
      }
    },
    initApp() {
      this.initTheme();
    },
    initTheme() {
      const { theme } = this;
      if (
        theme === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.theme = "dark";
      } else {
        this.theme = "light";
      }
      this.contorlThemeDom();
    },
    setTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.contorlThemeDom();
    },
    setModel(type: string) {
      this.modelType = type;
    },
    contorlThemeDom() {
      if (this.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    // 初始化全局快捷键注册
    async initGlobalShortcut() {
      const registered = await isRegistered(this.appSetting.globalShowWindow)
      console.log(registered, '全局快捷键WEi');
      const res = await invoke("greet", { name: '123' });
      console.log(res, 'res');
      if (!registered) {
        console.log('快捷键注册');
        await register(this.appSetting.globalShowWindow, async () => {
          // 触发快捷键
          const res = await invoke("greet", { name: '123' });
          console.log('快捷键触发', this.appSetting.globalShowWindow, res);
        });
      }
    },

  },
  persist: {
    storage: localStorage,
    paths: ["appSetting", "theme", "modelType"],
  },
});
