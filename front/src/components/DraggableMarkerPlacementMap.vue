<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { Center, Pin, ColorCode } from "@/types/map-interfaces";

const props = defineProps({
  pin: { type: Object as PropType<Pin>, required: false },
});

const colorMap = {
  red: { light: "orangered", dark: "firebrick" },
  blue: { light: "dodgerblue", dark: "royalblue" },
  green: { light: "limegreen", dark: "forestgreen" },
  yellow: { light: "gold", dark: "goldenrod" },
};
let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];

// ピンに色を付けるための関数。濃淡の2色を使う
const customPinColor = (color?: ColorCode) => {
  const defaultLightColor = colorMap.red.light;
  const defaultDarkColor = colorMap.red.dark;
  if (!color) {
    return {
      background: defaultLightColor,
      glyphColor: defaultDarkColor,
      borderColor: defaultDarkColor,
    };
  } else {
    return {
      background: colorMap[color].light,
      glyphColor: colorMap[color].dark,
      borderColor: colorMap[color].dark,
    };
  }
};

const loadeGoogleMapsLibrary = async () => {
  const loader = new Loader({
    apiKey: process.env.VUE_APP_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps", "marker"],
  });
  const { Map } = await loader.importLibrary("maps");
  const { PinElement } = await loader.importLibrary("marker");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  return { Map, PinElement, AdvancedMarkerElement };
};

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const initMap = async () => {
  const { Map } = await loadeGoogleMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;
  map = new Map(mapElement, {
    center: center,
    zoom: 12,
    draggableCursor: "default",

    // 高度なマーカーを使用するためにmapIdの取得が必要
    mapId: process.env.VUE_APP_MAP_ID,
  });
};

const initPins = async () => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  if (!props.pin) return;
  const customPin = new PinElement(customPinColor(props.pin.color));
  const marker = new AdvancedMarkerElement({
    position: props.pin.position,
    map: map,
    content: customPin.element,
  });
  // マーカーを操作するために保存する。pins[]と2重管理になる
  markers.push(marker);
};

onMounted(async () => {
  await initMap();
  await initPins();
});

onUpdated(async () => {
  // await initPins();
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
