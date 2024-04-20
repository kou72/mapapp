<script setup lang="ts">
import { onMounted, defineProps } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export interface Center {
  lat: number;
  lng: number;
}

export interface Pin {
  id: number;
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
  libraries: ["places"],
});

const mapMount = async (center: Center, pins: Pin[]) => {
  const google = await loader.load();
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const { PinElement } = await loader.importLibrary("marker");
  const mapElement = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapElement, {
    center: center,
    zoom: 12,
    mapId: process.env.VUE_APP_MAP_ID,
  });

  for (let pin of pins) {
    const customPin = new PinElement({
      // blue background
      background: "#8080FF",
      // blue glyph
      glyphColor: "#0000A0",
      // blue border
      borderColor: "#0000A0",
    });

    new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
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
  height: 90vh;
  width: 100%;
}
</style>
