<script setup lang="ts">
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { Center, Pin, ColorCode, PinStream } from "@/types/map-interfaces";

const props = defineProps({
  center: { type: Object as PropType<Center>, required: true },
  pins: { type: Array as PropType<Pin[]>, required: true },
  stream: Object as PropType<PinStream>,
});
const colorMap = {
  red: { light: "orangered", dark: "firebrick" },
  blue: { light: "dodgerblue", dark: "royalblue" },
  green: { light: "limegreen", dark: "forestgreen" },
  yellow: { light: "gold", dark: "goldenrod" },
};
let pins: Pin[] = [];
// eslint-disable-next-line
let map: google.maps.Map;
// eslint-disable-next-line
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
    libraries: ["places"],
  });
  const { Map } = await loader.importLibrary("maps");
  const { PinElement } = await loader.importLibrary("marker");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  return { Map, PinElement, AdvancedMarkerElement };
};

const initMap = async () => {
  const { Map } = await loadeGoogleMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;
  map = new Map(mapElement, {
    center: props.center,
    zoom: 12,
    // 高度なマーカーを使用するためにmapIdの取得が必要
    mapId: process.env.VUE_APP_MAP_ID,
  });
};

const initPins = async () => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  pins = props.pins;
  for (let pin of pins) {
    const customPin = new PinElement(customPinColor(pin.color));
    const marker = new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
    });
    // マーカーを操作するために保存する。pins[]と2重管理になる
    markers.push(marker);
  }
};

const removePin = async (id: string) => {
  // 配置したピンを削除するには marker.map = null とする必要がある
  // markers[]はidを持たないため、pins[]からidを取得して特定する
  const i = pins.findIndex((pin) => pin.id === id);
  markers[i].map = null;
  // 削除したpinをpins[]から取り除く
  // markers[]も同期させる必要があるため合わせて削除
  pins.splice(i, 1);
  markers.splice(i, 1);
};

const insertPin = async (item: Pin) => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  const customPin = new PinElement(customPinColor(item.color));
  const marker = new AdvancedMarkerElement({
    position: item.position,
    map: map,
    content: customPin.element,
  });
  // pins[]とmarkers[]は同期させる必要があるので合わせて追加
  pins.push(item);
  markers.push(marker);
};

const modifyPin = async (id: string, item: Pin) => {
  removePin(id);
  insertPin(item);
};

const updatePins = async (stream: PinStream) => {
  if (stream.operation == "REMOVE") await removePin(stream.id);
  // REMOVEの場合はitemがないためundefinedの場合は処理を抜ける
  if (stream.item === undefined) return;
  if (stream.operation === "INSERT") await insertPin(stream.item);
  if (stream.operation == "MODIFY") await modifyPin(stream.id, stream.item);
};

onMounted(async () => {
  await initMap();
});

onUpdated(async () => {
  // ピンはAPIからフェッチすためonMountedではなくonUpdatedで初期化する
  if (!props.stream) await initPins();
  // ピンの更新がある度にprops.streamを受け取り最小限の範囲で再描画する
  if (props.stream) await updatePins(props.stream);
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
