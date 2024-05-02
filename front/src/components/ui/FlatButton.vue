<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  func: {
    type: Function,
    required: false,
  },
});

const onClick = () => {
  if (!props.func) return;
  props.func();
};
</script>

<template>
  <v-btn
    @click="onClick"
    class="px-4"
    variant="flat"
    color="light-blue"
    rounded
  >
    {{ text }}
  </v-btn>
</template>
