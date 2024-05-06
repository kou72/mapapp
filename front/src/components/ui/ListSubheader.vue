<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  text: { type: String, required: false },
});
</script>

<template>
  <v-list-subheader
    color="grey-darken-2"
    class="text-left bg-light-blue-lighten-4"
  >
    {{ text }}
  </v-list-subheader>
</template>
