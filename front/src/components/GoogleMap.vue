<script lang="ts">
export interface Center {
  lat: number;
  lng: number;
}

export type ColorCode = "red" | "blue" | "green" | "yellow";
export interface Pin {
  id: string;
  name: string;
  group: string;
  color?: ColorCode;
  position: { lat: number; lng: number };
}
</script>

<script setup lang="ts">
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const props = defineProps({
  center: Object as PropType<Center>,
  pins: Array as PropType<Pin[]>,
});
const center = props.center as Center;
const colorMap = {
  red: { main: "orangered", sub: "firebrick" },
  blue: { main: "dodgerblue", sub: "royalblue" },
  green: { main: "limegreen", sub: "forestgreen" },
  yellow: { main: "gold", sub: "goldenrod" },
};
// eslint-disable-next-line
let map: google.maps.Map;
// eslint-disable-next-line
let markers: google.maps.marker.AdvancedMarkerElement[] = [];

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
  const { Map } = await loadeMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;

  map = new Map(mapElement, {
    center: center,
    zoom: 12,
    mapId: process.env.VUE_APP_MAP_ID,
  });
});

onUpdated(async () => {
  const { PinElement, AdvancedMarkerElement } = await loadeMapsLibrary();

  // 描画の重複を避けるためmarkerを全て削除
  for (let marker of markers) marker.map = null;

  for (let pin of props.pins as Pin[]) {
    const customPin = new PinElement(customPinColor(pin.color));
    const marker = new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
    });
    markers.push(marker);
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
