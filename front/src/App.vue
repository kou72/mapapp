<script setup lang="ts">
import { onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

interface Center {
  lat: number;
  lng: number;
}

interface Pin {
  name: string;
  group: string;
  position: { lat: number; lng: number };
}

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
* {
  margin: 0;
  padding: 0;
}
#map {
  height: 100vh;
  width: 100%;
}
</style>
