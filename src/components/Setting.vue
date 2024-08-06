<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { InputInst } from 'naive-ui';
import { createDiscreteApi } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';
import { unregister } from '@tauri-apps/api/globalShortcut';
import { version } from '@root/package.json';
import { getVersion } from '@tauri-apps/api/app';

const appVersion = ref(version);
const { message } = createDiscreteApi(['message']);
const appStore = useAppStore();
const { showSetting, appSetting } = storeToRefs(appStore);
const shortcutRef = ref<InputInst | null>(null);

const shortcutBak = ref('');
const shortcutBlur = async () => {
  appStore.setShortcutUpdateStatus(false);
  //失焦后判断快捷键是否已改变
  if (shortcutBak.value !== appSetting.value.globalShowWindow) {
    await unregister(shortcutBak.value);
    appStore.initGlobalShortcut();
    message.success('设置成功');
  }
  // appSetting.value.globalShowWindow = shortcutBak.value;
};
const shortcutFocus = () => {
  shortcutBak.value = appSetting.value.globalShowWindow;
  appStore.setShortcutUpdateStatus(true);
};
const getUpdateLoading = ref(false);
const checkVersion = async () => {
  getUpdateLoading.value = true;
  try {
    const hasNewVersion = await appStore.checkAppUpdate();
    getUpdateLoading.value = false;
    if (!hasNewVersion) {
      message.success('当前已是最新版本');
    } else {
      appStore.setGlobalDialogOption({
        title: '更新提示',
        content: '发现新版本,是否安装更新？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          appStore.updateVersion();
        }
      })
    }
  } catch (error) {
    message.error('检查更新失败');
  } finally {
    getUpdateLoading.value = false;
  }
};
onMounted(async () => {
  appVersion.value = await getVersion();
});
</script>
<template>
  <n-modal v-model:show="showSetting" preset="card" title="设置" style="height: 100vh">
    <div class="setting beauty-scroll-primary">
      <n-form label-placement="left" size="small" ref="formRef">
        <n-space vertical>
          <n-card title="快捷键设置">
            <n-form-item label="全局显示/隐藏窗口">
              <n-input
                ref="shortcutRef"
                v-model:value="appSetting.globalShowWindow"
                round
                readonly
                placeholder="请输入快捷键"
                @blur="shortcutBlur"
                @focus="shortcutFocus"
              />
            </n-form-item>
          </n-card>
          <n-card title="chatGPT-next-web Api">
            <n-form-item label="是否启用api">
              <n-switch v-model:value="appSetting.isUseNextWebApi" />
            </n-form-item>
            <n-collapse-transition :show="appSetting.isUseNextWebApi">
              <n-form-item label="web地址">
                <n-input v-model:value="appSetting.nextWebUrl" type="text" placeholder="请输入域名" />
              </n-form-item>
              <n-form-item label="web密码">
                <n-input
                  v-model:value="appSetting.nextWebPassword"
                  type="password"
                  show-password-on="mousedown"
                  placeholder="请输入密码(可选)，没有设置留空"
                />
              </n-form-item>
            </n-collapse-transition>
          </n-card>
          <n-card>
            <template #header>
              <span class="mr-2">百度翻译</span>
              <n-tag v-show="!appSetting.isUseCustomBaidu" :bordered="false" type="success"> 已启用变量 </n-tag>
              <n-tag v-show="appSetting.isUseCustomBaidu" :bordered="false"> 自定义 </n-tag>
            </template>
            <n-form-item label="是否自定义Key">
              <n-switch v-model:value="appSetting.isUseCustomBaidu" />
            </n-form-item>
            <n-collapse-transition :show="appSetting.isUseCustomBaidu">
              <n-form-item label="appId">
                <n-input v-model:value="appSetting.baiduAppId" type="text" placeholder="请输入appId" />
              </n-form-item>
              <n-form-item label="密钥">
                <n-input v-model:value="appSetting.baiiduSecret" type="text" placeholder="请输入密钥" />
              </n-form-item>
            </n-collapse-transition>
          </n-card>
          <n-card>
            <template #header>
              <span class="mr-2">Google Gemini</span>
              <n-tag v-show="!appSetting.isUseCustomGeminiApi" :bordered="false" type="success"> 已启用变量 </n-tag>
              <n-tag v-show="appSetting.isUseCustomGeminiApi" :bordered="false"> 自定义 </n-tag>
            </template>
            <n-form-item label="是否自定义Key">
              <n-switch v-model:value="appSetting.isUseCustomGeminiApi" />
            </n-form-item>
            <n-collapse-transition :show="appSetting.isUseCustomGeminiApi">
              <n-form-item label="key">
                <n-input v-model:value="appSetting.geminiKey" type="text" placeholder="请输入key" />
              </n-form-item>
            </n-collapse-transition>
          </n-card>
          <n-card>
            <template #header>
              <span class="mr-2">OpenAi ChatGpt</span>
              <n-tag v-show="!appSetting.isUseCustomOpenAiApi" :bordered="false" type="success"> 已启用变量 </n-tag>
              <n-tag v-show="appSetting.isUseCustomOpenAiApi" :bordered="false"> 自定义 </n-tag>
            </template>
            <n-form-item label="是否自定义Key">
              <n-switch v-model:value="appSetting.isUseCustomOpenAiApi" />
            </n-form-item>
            <n-collapse-transition :show="appSetting.isUseCustomOpenAiApi">
              <n-form-item label="key">
                <n-input v-model:value="appSetting.openAiKey" type="text" placeholder="请输入key" />
              </n-form-item>
            </n-collapse-transition>
          </n-card>
          <n-card title="检查更新">
            <n-form-item label="当前版本" size="large">
              <n-flex justify="space-between" align="center">
                <n-badge :dot="appStore.hasUpdate">
                  <p>{{ appVersion }}</p>
                </n-badge>
                <div class="w-24 text-right">
                  <n-button v-if="appStore.hasUpdate" text type="primary" @click="appStore.updateVersion">
                    发现新版本，点击更新
                  </n-button>
                  <n-button v-else :loading="getUpdateLoading" text type="primary" @click="checkVersion"> 检查更新 </n-button>
                </div>
              </n-flex>
            </n-form-item>
          </n-card>
        </n-space>
      </n-form>
    </div>
  </n-modal>
</template>

<style>
.n-card .n-card__content {
  overflow: hidden;
}
.setting {
  height: 100%;
  overflow: auto;
}
</style>
