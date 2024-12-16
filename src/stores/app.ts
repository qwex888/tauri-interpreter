import { defineStore } from "pinia";
import { createDiscreteApi } from 'naive-ui';
import { isRegistered, register } from '@tauri-apps/api/globalShortcut';
import { invoke } from "@tauri-apps/api/tauri";
import { checkUpdate, installUpdate, onUpdaterEvent } from '@tauri-apps/api/updater';
import { type as platformType } from '@tauri-apps/api/os';
import { relaunch } from '@tauri-apps/api/process'
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
        globalShowWindow: 'alt+shift+f',
        isStartUp: false
      },
      theme: "",
      modelType: "baidu",
      showSetting: false,
      updater: false,
      shortcutUpdating: false,
      hasUpdate: false,
      globalDialogOption: {
        title: "提示",
        content: "",
        show: false,
        positiveText: "确定",
        negativeText: "取消",
      }
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
    setShortcutUpdateStatus(status: boolean) {
      this.shortcutUpdating = status;
    },
    setGlobalShortcut(key: string) {
      this.appSetting.globalShowWindow = key || this.appSetting.globalShowWindow;
    },
    // 初始化全局快捷键注册
    async initGlobalShortcut() {
      const registered = await isRegistered(this.appSetting.globalShowWindow)
      console.log(`是否已全局注册快捷键[${this.appSetting.globalShowWindow}]: ${registered}`);
      if (!registered) {
        await register(this.appSetting.globalShowWindow, async () => {
          if (this.shortcutUpdating) return;
          // 触发快捷键
          await invoke("shortcut");
          // console.log('快捷键触发', this.appSetting.globalShowWindow, res);
        });
      }
    },
    async checkAppUpdate() {
      try {
        const { shouldUpdate } = await checkUpdate();
        console.log('检查更新结果：', shouldUpdate);
        this.hasUpdate = shouldUpdate;
        return shouldUpdate;
      } catch (error) {
        this.hasUpdate = false;
        console.log('检查更新失败：', error);
        return error;
      }
    },
    async updateVersion() {
      const { message } = createDiscreteApi(['message']);
      message.info('开始下载更新...');
      try {
        onUpdaterEvent(async ({ error, status }) => {
          // 'PENDING' | 'ERROR' | 'DONE' | 'UPTODATE'
          console.log('Updater event', error, status);
          if (status === 'DONE') {
            this.hasUpdate = false;
            const platformName = await platformType();
            if (platformName !== 'Windows_NT') {
              this.setGlobalDialogOption({
                title: '更新提示',
                content: '更新完成，是否重启应用？',
                onPositiveClick: () => {
                  relaunch();
                }
              })
            }
          }
        });
        await installUpdate();
      } catch (error) {
        console.log('更新失败：', error);
      }
    },
    setGlobalDialogOption(option: any) {
      this.globalDialogOption = {...this.globalDialogOption, ...option, show: true};
    },
    hideGlobalDialog() {
      this.globalDialogOption.show = false;
    }
  },
  persist: {
    storage: localStorage,
    paths: ["appSetting", "theme", "modelType"],
  },
});
