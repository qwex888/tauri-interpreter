<script setup lang="ts">
import { defineProps, defineEmits, } from 'vue';
import { useAppStore } from "@/stores/app";
const emit = defineEmits(['positive-click', 'negative-click']);
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
});
const appStore = useAppStore();

const submitCallback = () => {
  emit('positive-click');
  if (props.options.onPositiveClick && typeof props.options.onPositiveClick === 'function') {
    props.options.onPositiveClick();
  }
};
const cancelCallback = () => {
  appStore.hideGlobalDialog();
  emit('negative-click');
  if (props.options.onNegativeClick && typeof props.options.onNegativeClick === 'function') {
    props.options.onNegativeClick();
  }
};
</script>

<template>
  <n-modal
    v-model:show="props.options.show"
    :title="props.options.title"
    :content="props.options.content"
    :positive-text="props.options.positiveText"
    :negative-text="props.options.negativeText"
    preset="dialog"
    @positive-click="submitCallback"
    @negative-click="cancelCallback"
  >
  </n-modal>
</template>
