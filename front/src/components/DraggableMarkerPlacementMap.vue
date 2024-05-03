<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/
import { onMounted, defineEmits, defineExpose } from "vue";
import { Center, Pin, ColorCode } from "@/types/map-interfaces";
import { customPinsColor } from "@/utils/customPinsColor";
import { loadeGoogleMapsLibrary } from "@/utils/loadeGoogleMapsLibrary";

// 親コンポーネントにpinの値の変更を通知するためのemit
const emit = defineEmits(["update:parentPin"]);
const updateParentPin = (value: Pin) => emit("update:parentPin", value);

let pin: Pin = {
  id: "",
  name: "",
  group: "赤",
  color: "red" as ColorCode,
  position: undefined,
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
    // 高度なマーカーを使用するためにmapIdが必要
    mapId: process.env.VUE_APP_MAP_ID,
  });
  map.addListener("click", (e: google.maps.MapMouseEvent) =>
    setClickPositionPin(e)
  );
};

const setPin = async (newPin: Pin) => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  // newPinを使っても描画できるが、pinを更新して利用する
  // マップ側の更新がpin経由で親コンポーネントに通知されるため
  pin = newPin;
  const customPin = new PinElement(customPinsColor(pin.color));
  const marker = new AdvancedMarkerElement({
    position: pin.position,
    map: map,
    content: customPin.element,
    gmpDraggable: true, // ドラッグ可能にする
  });
  marker.addListener("drag", (e: google.maps.MapMouseEvent) => {
    updateDragPinPosition(e);
  });
  // 必要なピンは1つだけなのでmarkers[]も常に1つだけ
  // 既存のピンがあれば非表示にした後に削除する
  if (markers[0]) {
    markers[0].map = null;
    markers.splice(0, 1);
  }
  // markers.pushしなくても描画されるが、マーカー操作に必要なため保存する
  markers.push(marker);
};

// setPinを親コンポーネントからpin発火できるようにexportする
defineExpose({ setPin });

const setClickPositionPin = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  const newPin: Pin = { ...pin, position: newPosition };
  setPin(newPin);
  updateParentPin(newPin);
};

const updateDragPinPosition = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  const newPin: Pin = { ...pin, position: newPosition };
  // pinは更新するがsetPin()はしない。ドラッグ中なのでピンの描画は不要なため
  pin = newPin;
  updateParentPin(newPin);
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
