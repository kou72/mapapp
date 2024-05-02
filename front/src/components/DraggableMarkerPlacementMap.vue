<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { Center, Pin } from "@/types/map-interfaces";
import { customPinsColor } from "@/utils/customPinsColor";

const props = defineProps({
  pin: { type: Object as PropType<Pin>, required: false },
});

let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];

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
  const customPin = new PinElement(customPinsColor(props.pin.color));
  const marker = new AdvancedMarkerElement({
    position: props.pin.position,
    map: map,
    content: customPin.element,
    gmpDraggable: true,
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
