<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const center = ref({ lat: 35.6812362, lng: 139.7645445 });
const pin = ref([
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
]);

const loader = new Loader({
  apiKey: process.env.VUE_APP_MAPS_API_KEY,
  version: "weekly",
});

onMounted(async () => {
  const google = await loader.load();
  const mapElement = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapElement, {
    center: center.value,
    zoom: 12,
  });

  for (let i = 0; i < pin.value.length; i++) {
    new google.maps.Marker({
      position: pin.value[i].position,
      map: map,
    });
  }
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
