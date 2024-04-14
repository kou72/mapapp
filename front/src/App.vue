<script setup lang="ts">
import GoogleMap, { Center, Pin } from "./components/GoogleMap.vue";
import PinList from "./components/PinList.vue";

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const pins: Pin[] = [
  {
    id: 1,
    name: "東京駅",
    group: "お気に入り",
    position: { lat: 35.6812362, lng: 139.7645445 },
  },
  {
    id: 2,
    name: "新宿駅",
    group: "お気に入り",
    position: { lat: 35.6896342, lng: 139.700645 },
  },
  {
    id: 3,
    name: "品川駅",
    group: "お気に入り",
    position: { lat: 35.62876, lng: 139.738308 },
  },
  {
    id: 4,
    name: "池袋駅",
    group: "お気に入り",
    position: { lat: 35.729799, lng: 139.710052 },
  },
];
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <GoogleMap :center="center" :pins="pins" />
    </v-col>
    <v-col cols="4" class="align-center">
      <PinList :pins="pins"></PinList>
    </v-col>
  </v-row>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
