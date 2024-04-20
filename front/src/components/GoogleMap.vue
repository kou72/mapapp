<script lang="ts">
export interface Center {
  lat: number;
  lng: number;
}

type ColorCode = "red" | "blue" | "green" | "yellow";
export interface Pin {
  id: number;
  name: string;
  group: string;
  color?: ColorCode;
  position: { lat: number; lng: number };
}
</script>

<script setup lang="ts">
import { onMounted, defineProps } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const props = defineProps({ center: Object, pins: Array });
const center = props.center as Center;
const pins = props.pins as Pin[];
const colorMap = {
  red: { main: "orangered", sub: "firebrick" },
  blue: { main: "dodgerblue", sub: "royalblue" },
  green: { main: "limegreen", sub: "forestgreen" },
  yellow: { main: "gold", sub: "goldenrod" },
};

const customPinColor = (color?: ColorCode) => {
  const defaultMainColor = colorMap.red.main;
  const defaultSubColor = colorMap.red.sub;
  if (!color) {
    return {
      background: defaultMainColor,
      glyphColor: defaultSubColor,
      borderColor: defaultSubColor,
    };
  } else {
    return {
      background: colorMap[color].main,
      glyphColor: colorMap[color].sub,
      borderColor: colorMap[color].sub,
    };
  }
};

const loadeMapsLibrary = async () => {
  const loader = new Loader({
    apiKey: process.env.VUE_APP_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });
  const { Map } = await loader.importLibrary("maps");
  const { PinElement } = await loader.importLibrary("marker");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  return { Map, PinElement, AdvancedMarkerElement };
};

onMounted(async () => {
  const { Map, PinElement, AdvancedMarkerElement } = await loadeMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;

  const map = new Map(mapElement, {
    center: center,
    zoom: 12,
    mapId: process.env.VUE_APP_MAP_ID,
  });

  for (let pin of pins) {
    const customPin = new PinElement(customPinColor(pin.color));
    new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
    });
  }
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
