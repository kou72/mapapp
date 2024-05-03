<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/

import { onMounted, defineEmits, defineExpose } from "vue";
import { Center, Pin, ColorCode } from "@/types/map-interfaces";
import { customPinsColor } from "@/utils/customPinsColor";
import { loadeGoogleMapsLibrary } from "@/utils/loadeGoogleMapsLibrary";

// pinの値が変更されたときに親コンポーネントに通知する
const emit = defineEmits(["update:parentPin"]);
const updateParentPin = (value: Pin) => emit("update:parentPin", value);

let pin: Pin = {
  id: "",
  name: "",
  group: "",
  color: "red" as ColorCode,
  position: { lat: 0, lng: 0 },
};
let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];

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
  // マップをクリックしたときにピンを配置する
  map.addListener("click", (e: google.maps.MapMouseEvent) =>
    setEventPositionPin(e)
  );
};

const setPin = async (newPin: Pin) => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  // ピン情報を更新する。マップ上のイベントでピンを操作するときに使用する
  pin = newPin;
  const customPin = new PinElement(customPinsColor(pin.color));
  const marker = new AdvancedMarkerElement({
    position: pin.position,
    map: map,
    content: customPin.element,
    gmpDraggable: true,
  });
  marker.addListener("drag", (e: google.maps.MapMouseEvent) => {
    updateDraggablePinPosition(e);
  });
  // 必要なピンは1つだけなのでmarkers[]も常に1つだけ
  // 既存のピンがあれば削除する
  if (markers[0]) {
    markers[0].map = null;
    markers.splice(0, 1);
  }
  markers.push(marker);
};

// setPinを親コンポーネントからpin発火できるようにする
defineExpose({ setPin });

const setEventPositionPin = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  const newPin: Pin = { ...pin, position: newPosition };
  setPin(newPin);
  updateParentPin(newPin);
};

const updateDraggablePinPosition = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  const newPin: Pin = { ...pin, position: newPosition };
  updateParentPin(newPin);
  pin = newPin;
};

onMounted(async () => {
  await initMap();
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
