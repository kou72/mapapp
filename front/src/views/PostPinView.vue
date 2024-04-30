<script setup lang="ts">
import { Pin } from "@/types/map-interfaces";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
// const pin: Pin = { lat: 35.6812362, lng: 139.7645445 };
const pin: Pin = {
  id: "",
  name: "",
  group: "",
  color: "red",
  position: { lat: 35.6812362, lng: 139.7645445 },
};
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <DraggableMarkerPlacementMap :pin="pin" />
    </v-col>
    <v-col cols="4" class="text-center">
      <v-btn color="primary">ボタン</v-btn>
    </v-col>
  </v-row>
</template>
