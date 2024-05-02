<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: { type: String, required: false },
  modelValue: { type: String, required: false },
});

// テキストフィールドの値が変更されたときに親コンポーネントに通知する
const emit = defineEmits(["update:modelValue"]);
const updateValue = (value: string) => emit("update:modelValue", value);
</script>

<template>
  <v-label>{{ props.label }}</v-label>
  <v-text-field
    :model-value="props.modelValue"
    @input="updateValue($event.target.value)"
    variant="outlined"
    density="compact"
    hide-details
    single-line
    color="grey"
  ></v-text-field>
</template>
