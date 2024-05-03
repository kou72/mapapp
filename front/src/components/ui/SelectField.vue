<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: { type: String, required: false },
  modelValue: { type: String, required: false },
  selectfunc: { type: Function, required: false },
});

// テキストフィールドの値が変更されたときに親コンポーネントに通知する
const emit = defineEmits(["update:modelValue"]);
const updateValue = (value: string) => {
  emit("update:modelValue", value);
  if (props.selectfunc) props.selectfunc();
};
</script>

<template>
  <v-label>{{ props.label }}</v-label>
  <v-select
    :model-value="props.modelValue"
    :items="['赤', '青', '緑', '黄色']"
    @update:model-value="updateValue($event)"
    variant="outlined"
    density="compact"
    hide-details
    single-line
    color="grey"
  ></v-select>
</template>
