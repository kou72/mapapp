<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  searchInput: { type: String, required: false },
  loading: { type: Boolean, required: false },
  clickSearchIcon: { type: Function, required: false },
});

// テキストフィールドの値が変更されたときに親コンポーネントに通知する
const emit = defineEmits(["update:searchInput"]);
const updateValue = (value: string) => emit("update:searchInput", value);

const onClick = () => (props.clickSearchIcon ? props.clickSearchIcon() : null);
</script>

<template>
  <v-text-field
    :model-value="props.searchInput"
    @input="updateValue($event.target.value)"
    @keydown.enter="onClick"
    label="マップを検索する"
    density="compact"
    variant="outlined"
    hide-details
    color="grey"
    single-line
    rounded="xl"
  >
    <!-- text-fieldの内部にスロットでアイコンとロードアニメーションを追加 -->
    <template v-slot:append-inner>
      <v-progress-circular
        v-if="props.loading"
        indeterminate
        color="light-blue"
        size="20"
        width="2"
      ></v-progress-circular>
      <v-icon v-else icon="mdi-magnify" @click="onClick"></v-icon>
    </template>
  </v-text-field>
</template>
