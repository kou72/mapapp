<script setup lang="ts">
import { onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

onMounted(async () => {
  const loader = new Loader({
    apiKey: process.env.VUE_APP_MAPS_API_KEY,
    version: "weekly",
  });

  await loader
    .load()
    .then((google) => {
      const mapElement = document.getElementById("map") as HTMLElement;
      const map = new google.maps.Map(mapElement, {
        center: { lat: 41.90476224706472, lng: 12.49822074385094 },
        zoom: 4,
      });
      const marker = new google.maps.Marker({
        position: { lat: 41.90476224706472, lng: 12.49822074385094 },
        map: map,
      });
      console.log(map);
    })
    .catch((error) => console.log(error));
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
