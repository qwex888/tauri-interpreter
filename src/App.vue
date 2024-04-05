<script setup lang="ts">
import { ref } from "vue";
import gemini from '@/apis/gemini'
import baidu from '@/apis/baidu';

const question = ref("");
const answer = ref('');

const onConfirm = async () => {
    let fullText: string = '';
    if(!question.value)return
    const {status, data} = await gemini(question.value)
    if(status === 200) {
        data.forEach((i: { candidates: any[]; }) => {
            i.candidates.forEach((s: { content: any[]; }) => {
                s.content.forEach((y: { parts: any[]; }) => {
                    y.parts.forEach((z: { text: any; }) => {
                        fullText += `${z.text}; `
                    })
                })
            })
        });
    }
    answer.value = fullText
};
</script>

<template>
  <div class="container p-5 flex flex-col justify-center">
    <div>
        <select name="apiType" id="apiType">
            <option value="gemini">gemini</option>
            <option value="baidu">baidu</option>
        </select>
    </div>
    <form class="" @submit.prevent="onConfirm">
      <textarea id="greet-input" rows="5" v-model="question" placeholder="Enter a text..." />
      <button type="submit">send</button>
    </form>
    <div class="answer">
        {{ answer }}
    </div>
  </div>
</template>

<style scoped></style>
