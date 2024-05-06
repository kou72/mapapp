<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/
import {
  onMounted,
  defineEmits,
  defineExpose,
  defineProps,
  PropType,
} from "vue";
import { Center, ColorCode, Position } from "@/types/map-interfaces";
import { customPinsColor } from "@/utils/customPinsColor";
import { loadeGoogleMapsLibrary } from "@/utils/loadeGoogleMapsLibrary";

const props = defineProps({
  parentPinPosition: { type: Object as PropType<Position>, required: false },
  parentPinColor: { type: String as PropType<ColorCode>, required: false },
});

// 親コンポーネントにピンの位置の変更を通知するためのemit
const emit = defineEmits(["update:parentPinPosition"]);
const updateParentPinPosition = (value: Position) =>
  emit("update:parentPinPosition", value);

// eslint-disable-next-line vue/no-setup-props-destructure
// let pin: Pin = props.parentPin;
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
    placeClickPositionPin(e)
  );
};

const updatePin = async (position: Position, color: ColorCode) => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  const customPin = new PinElement(customPinsColor(color));
  const marker = new AdvancedMarkerElement({
    position: position,
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
  map.panTo(position);
};

const updatePinPosition = async (position: Position) => {
  if (!props.parentPinColor) return;
  updatePin(position, props.parentPinColor);
};

const updatePinColor = async (color: ColorCode) => {
  if (!props.parentPinPosition) return;
  updatePin(props.parentPinPosition, color);
};

// 親コンポーネントに関数を公開する
defineExpose({ updatePinPosition, updatePinColor });

const placeClickPositionPin = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  updatePinPosition(newPosition);
  updateParentPinPosition(newPosition);
};

const updateDragPinPosition = async (e: google.maps.MapMouseEvent) => {
  if (!e.latLng) return;
  const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  updateParentPinPosition(newPosition);
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
