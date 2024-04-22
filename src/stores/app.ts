import { defineStore } from "pinia";
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
        openAiKey: "",
        geminiKey: "",
        isUseCustomBaidu: false,
        baiduAppId: "",
        baiiduSecret: "",
      },
      theme: "",
      modelType: "baidu",
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
        this.appSetting.isUseNextWebApi &&
        this.appSetting.geminiKey
      ) {
        key = this.appSetting.geminiKey;
      }
      return key
    },
    getOpenAiKey() {
      let key = import.meta.env.VITE_OPENAI_API_KEY;
      if (
        this.appSetting.isUseNextWebApi &&
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
          return this.getGeminiKey();
        case OPENAI_OPTION:
          return this.getOpenAiKey();
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
  },
  persist: {
    storage: localStorage,
    paths: ["appSetting", "theme", "modelType"],
  },
});
