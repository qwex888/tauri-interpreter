<script setup lang="ts">
import { ref, onMounted } from "vue";
import gemini from "@/apis/gemini";
import baidu from '@/apis/baidu';
import { MoonIcon, SunIcon } from "@heroicons/vue/24/solid";
import { ClipboardDocumentListIcon } from "@heroicons/vue/24/outline";

const question = ref("");
const answer = ref("");
const theme = ref("light");
const apiVal = ref('baidu')
onMounted(() => {
  initTheme();
  initApi();
});
const changeTheme = () => {
  if (localStorage.theme === "dark") {
    localStorage.theme = "light";
  } else {
    localStorage.theme = "dark";
  }
  initTheme();
};
const initTheme = () => {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    theme.value = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    theme.value = "";
  }
};
const initApi = () => {
  if (localStorage.api === "gemini") {
    apiVal.value = "gemini";
  } else if (localStorage.api === "baidu") {
    apiVal.value = "baidu";
  }
};

const apiChange = (e: any) => {
    localStorage.api = e?.target?.value
    initApi();
};
const onConfirm = async () => {
  if (!question.value) return;
  const requestFn = apiVal.value === 'gemini' ? gemini : baidu;
  const text: string = await requestFn(question.value);
  answer.value = text;
};
const iconStyle = `w-6 cursor-pointer hover:text-slate-400 dark:hover:brightness-50`;
const blockStyle = `dark:text-slate-400 dark:bg-cyan-950 bg-white`;
</script>

<template>
  <div
    class="container mx-auto min-w-96 w-3/5 font-sans h-screen bg-slate-200 dark:bg-cyan-900 text-black dark:text-slate-200 rounded py-4 px-4"
  >
    <div class="mb-3 select-none flex justify-center items-center">
      <div :class="iconStyle">
        <MoonIcon v-if="theme === 'dark'" @click="changeTheme" />
        <SunIcon v-else @click="changeTheme" />
      </div>
      <div class="mx-6">
        <span class="">API: </span>
        <select
          class="w-24 p-1 dark:bg-cyan-950 dark:text-slate-400"
          name="apiType"
          id="apiType"
          :value="apiVal"
          @change="apiChange($event)"
        >
          <option value="gemini">gemini</option>
          <option value="baidu">baidu</option>
        </select>
      </div>
    </div>
    <div class="input-content flex flex-col justify-center">
      <form class="w-full" @submit.prevent="onConfirm">
        <div class="w-full block rounded-md overflow-hidden shadow-md">
          <textarea
            id="greet-input"
            :class="`${blockStyle} caret-blue-500  h-1/3 border-hidden align-top w-full p-2 overflow-auto resize-none focus:outline-none focus:ring focus:border-blue-500`"
            rows="5"
            v-model="question"
          />
        </div>

        <button
          type="submit"
          class="hover:bg-sky-700 my-4 mx-auto block px-3 py-2 rounded-md select-none font-semibold text-sm bg-sky-500 text-white shadow-sm"
        >
          send
        </button>
      </form>
    </div>
    <div :class="`${blockStyle} p-2 box-border rounded-md shadow-md`">
      <div class="control pb-1 mb-1 border-b border-slate-200 flex justify-end">
        <ClipboardDocumentListIcon title="copy" :class="iconStyle" />
      </div>
      <div :class="`min-h-40 h-52 output overflow-hidden overflow-y-scroll`">
        <span>{{ answer }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
