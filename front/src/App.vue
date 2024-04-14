<script setup lang="ts">
import GoogleMap, { Center, Pin } from "./components/GoogleMap.vue";

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const pins: Pin[] = [
  {
    name: "東京駅",
    group: "お気に入り",
    position: { lat: 35.6812362, lng: 139.7645445 },
  },
  {
    name: "新宿駅",
    group: "お気に入り",
    position: { lat: 35.6896342, lng: 139.700645 },
  },
  {
    name: "品川駅",
    group: "お気に入り",
    position: { lat: 35.62876, lng: 139.738308 },
  },
  {
    name: "池袋駅",
    group: "お気に入り",
    position: { lat: 35.729799, lng: 139.710052 },
  },
];
</script>

<template>
  <GoogleMap :center="center" :pins="pins" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
