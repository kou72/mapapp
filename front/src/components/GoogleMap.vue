<script setup lang="ts">
import { onMounted, defineProps } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export interface Center {
  lat: number;
  lng: number;
}

export interface Pin {
  name: string;
  group: string;
  position: { lat: number; lng: number };
}

const props = defineProps({
  center: Object,
  pins: Array,
});

const center = props.center as Center;
const pins = props.pins as Pin[];

const loader = new Loader({
  apiKey: process.env.VUE_APP_MAPS_API_KEY,
  version: "weekly",
});

const mapMount = async (center: Center, pins: Pin[]) => {
  const google = await loader.load();
  const mapElement = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapElement, {
    center: center,
    zoom: 12,
  });
  for (let pin of pins) {
    new google.maps.Marker({
      position: pin.position,
      map: map,
    });
  }
};

onMounted(async () => {
  mapMount(center, pins);
});
</script>

<template>
  <div id="map"></div>
</template>

<style>
#map {
  height: 100vh;
  width: 100%;
}
</style>
