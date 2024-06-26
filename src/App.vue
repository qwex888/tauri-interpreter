<script setup lang="ts">
import { ref, onMounted } from "vue";
import useClipboard from "vue-clipboard3";
import { darkTheme, createDiscreteApi } from "naive-ui";
import { storeToRefs } from "pinia";

import gemini from "@/apis/gemini";
import baidu from "@/apis/baidu";
import openai from "@/apis/openai";

import { MoonIcon, SunIcon, Cog6ToothIcon } from "@heroicons/vue/24/solid";
import { ClipboardDocumentListIcon } from "@heroicons/vue/24/outline";
import Setting from "@/components/Setting.vue";

import { API_OPTIONS, GEMINI_OPTION, OPENAI_OPTION } from "@/constants/index";
import { useAppStore } from "@/stores/app";

const { message } = createDiscreteApi(["message"]);
const { toClipboard } = useClipboard();
const appStore = useAppStore();
const { theme, modelType, showSetting } = storeToRefs(appStore);
const question = ref("");
const answer = ref("");

onMounted(() => {
  appStore.initTheme();
});

const apiChange = (e: any) => {
  appStore.setModel(e?.target?.value);
};

const isLoading = ref(false);

const onConfirm = async () => {
  if (!question.value) return;
  // 检查该模型的key是否存在
  const flag = appStore.checkApi();
  if (!flag) return;
  isLoading.value = true;
  try {
    const requestFn =
      modelType.value === OPENAI_OPTION
        ? openai
        : modelType.value === GEMINI_OPTION
        ? gemini
        : baidu;
    const text: string = await requestFn(question.value);
    answer.value = text;
  } catch (err) {
    message.error("发送失败！");
  } finally {
    isLoading.value = false;
  }
};

const toCopy = async () => {
  if (!answer.value) return;
  try {
    await toClipboard(answer.value);
    console.log("Copied to clipboard");
    showToast("复制成功！");
  } catch (e) {
    showToast("复制失败！");
    console.error(e);
  }
};

const showToast = (msg: string) => {
  message.info(msg);
};

const openSetting = () => {
  showSetting.value = true;
};

const iconStyle = `w-6 cursor-pointer hover:text-slate-400 dark:hover:brightness-50`;
const blockStyle = `dark:text-slate-400 dark:bg-cyan-950 bg-white`;
</script>

<template>
  <n-config-provider :theme="theme === 'dark' ? darkTheme : undefined">
    <div
      class="container m-0 relative mx-auto min-w-96 font-sans h-screen bg-slate-200 dark:bg-cyan-900 text-black dark:text-slate-200 rounded py-4 px-4"
    >
      <Spinner v-show="isLoading" />
      <div class="control flex items-center mb-3">
        <div class="left"></div>
        <div class="flex-1 select-none inline-flex justify-center items-center">
          <div :class="iconStyle">
            <MoonIcon v-if="theme === 'dark'" @click="appStore.setTheme" />
            <SunIcon v-else @click="appStore.setTheme" />
          </div>
          <div class="mx-6">
            <span class="">API: </span>
            <select
              class="w-24 p-1 dark:bg-cyan-950 dark:text-slate-400"
              name="apiType"
              id="apiType"
              :value="modelType"
              @change="apiChange($event)"
            >
              <option
                v-for="item in API_OPTIONS"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="right">
          <Cog6ToothIcon :class="iconStyle" @click="openSetting" />
        </div>
      </div>
      <div class="input-content flex flex-col justify-center">
        <form class="w-full" @submit.prevent="onConfirm">
          <div
            class="input-block w-full block rounded-md overflow-hidden shadow-md"
          >
            <textarea
              id="greet-input"
              :class="`${blockStyle} caret-blue-500 h-full border-hidden align-top w-full p-2 overflow-auto resize-none focus:outline-none focus:ring focus:border-blue-500`"
              rows="5"
              v-model="question"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="hover:bg-sky-700 my-4 mx-auto block px-3 py-2 rounded-md select-none font-semibold text-sm bg-sky-500 text-white shadow-sm"
          >
            send
          </button>
        </form>
      </div>
      <div :class="`${blockStyle} p-2 box-border rounded-md shadow-md`">
        <div
          class="control pb-1 mb-1 border-b border-slate-300/55 flex justify-end"
        >
          <ClipboardDocumentListIcon
            title="copy"
            :class="iconStyle"
            @click="toCopy"
          />
        </div>
        <div :class="`min-h-40 output-block overflow-hidden overflow-y-scroll`">
          <span>{{ answer }}</span>
        </div>
      </div>
    </div>
    <Setting />
  </n-config-provider>
</template>

<style scoped></style>
