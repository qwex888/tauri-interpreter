<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const { showSetting, appSetting } = storeToRefs(appStore);
</script>
<template>
  <n-modal
    v-model:show="showSetting"
    preset="card"
    title="设置"
    style="height: 100vh"
  >
    <n-form label-placement="left" size="small" ref="formRef">
      <n-space vertical>
        <n-card title="chatGPT-next-web Api">
          <n-form-item label="是否启用api">
            <n-switch v-model:value="appSetting.isUseNextWebApi" />
          </n-form-item>
          <n-collapse-transition :show="appSetting.isUseNextWebApi">
            <n-form-item label="web地址">
              <n-input
                v-model:value="appSetting.nextWebUrl"
                type="text"
                placeholder="请输入域名"
              />
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
            <n-tag
              v-show="!appSetting.isUseCustomBaidu"
              :bordered="false"
              type="success"
            >
              已启用变量
            </n-tag>
            <n-tag v-show="appSetting.isUseCustomBaidu" :bordered="false">
              自定义
            </n-tag>
          </template>
          <n-form-item label="是否自定义Key">
            <n-switch v-model:value="appSetting.isUseCustomBaidu" />
          </n-form-item>
          <n-collapse-transition :show="appSetting.isUseCustomBaidu">
            <n-form-item label="appId">
              <n-input
                v-model:value="appSetting.baiduAppId"
                type="text"
                placeholder="请输入appId"
              />
            </n-form-item>
            <n-form-item label="密钥">
              <n-input
                v-model:value="appSetting.baiiduSecret"
                type="text"
                placeholder="请输入密钥"
              />
            </n-form-item>
          </n-collapse-transition>
        </n-card>
        <n-card>
          <template #header>
            <span class="mr-2">Google Gemini</span>
            <n-tag
              v-show="!appSetting.isUseCustomGeminiApi"
              :bordered="false"
              type="success"
            >
              已启用变量
            </n-tag>
            <n-tag v-show="appSetting.isUseCustomGeminiApi" :bordered="false">
              自定义
            </n-tag>
          </template>
          <n-form-item label="是否自定义Key">
            <n-switch v-model:value="appSetting.isUseCustomGeminiApi" />
          </n-form-item>
          <n-collapse-transition :show="appSetting.isUseCustomGeminiApi">
            <n-form-item label="key">
              <n-input
                v-model:value="appSetting.geminiKey"
                type="text"
                placeholder="请输入key"
              />
            </n-form-item>
          </n-collapse-transition>
        </n-card>
        <n-card>
          <template #header>
            <span class="mr-2">OpenAi ChatGpt</span>
            <n-tag
              v-show="!appSetting.isUseCustomOpenAiApi"
              :bordered="false"
              type="success"
            >
              已启用变量
            </n-tag>
            <n-tag v-show="appSetting.isUseCustomOpenAiApi" :bordered="false">
              自定义
            </n-tag>
          </template>
          <n-form-item label="是否自定义Key">
            <n-switch v-model:value="appSetting.isUseCustomOpenAiApi" />
          </n-form-item>
          <n-collapse-transition :show="appSetting.isUseCustomOpenAiApi">
            <n-form-item label="key">
              <n-input
                v-model:value="appSetting.openAiKey"
                type="text"
                placeholder="请输入key"
              />
            </n-form-item>
          </n-collapse-transition>
        </n-card>
      </n-space>
    </n-form>
  </n-modal>
</template>

<style lang="scss" scoped></style>
