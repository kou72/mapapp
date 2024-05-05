<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  title: { type: String, required: false },
  subTitle1: { type: String, required: false },
  subTitle2: { type: String, required: false },
  btnIcon1: { type: String, required: false },
  btnIcon2: { type: String, required: false },
});
</script>

<template>
  <v-list-item class="text-left bg-light-blue-lighten-5 py-1">
    <v-list-item-title class="text-grey-darken-3">
      {{ title }}
    </v-list-item-title>
    <v-list-item-subtitle>
      <v-row>
        <v-col>{{ subTitle1 }}</v-col>
        <v-col>{{ subTitle2 }}</v-col>
      </v-row>
    </v-list-item-subtitle>
    <template v-slot:append>
      <v-btn
        color="light-blue-lighten-2"
        :icon="btnIcon1"
        variant="text"
      ></v-btn>
      <v-btn
        color="light-blue-lighten-2"
        :icon="btnIcon2"
        variant="text"
      ></v-btn>
    </template>
  </v-list-item>
</template>
