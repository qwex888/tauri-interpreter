import { defineStore } from "pinia";
import { isRegistered, register } from '@tauri-apps/api/globalShortcut';
import { invoke } from "@tauri-apps/api/tauri";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
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
        globalShowWindow: 'CmdOrControl+shift+f'
      },
      theme: "",
      modelType: "baidu",
      showSetting: false,
      updater: false
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
      console.log(`全局是否已快捷键${registered}`);
      // const res = await invoke("greet", { name: '123' });
      // console.log(res, 'res');
      if (!registered) {
        await register(this.appSetting.globalShowWindow, async () => {
          // 触发快捷键
          // const res = await invoke("greet", { name: '123' });
          console.log('快捷键触发', this.appSetting.globalShowWindow);
        });
      }
    },
    async checkUpdate() {
      const update = await check();
      this.updater = !!update?.available
      // if (update?.available) {
      //   await update.downloadAndInstall();
      //   await relaunch();
      // }

      // await updater.downloadAndInstall((p) => {
      //   if (p.event === "Progress") {
      //     setProgress(p.data.chunkLength);
      //   }
      // });

      // setUpdating(false);
      // const res = await ask(t`更新下载完成，是否立即重启应用？`, {
      //   title: t`提示`,
      //   kind: "info",
      // });
    }
  },
  persist: {
    storage: localStorage,
    paths: ["appSetting", "theme", "modelType"],
  },
});
