<script setup lang="ts">
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { Center, Pin, ColorCode, StreamPins } from "@/types/map-interfaces";

const props = defineProps({
  center: Object as PropType<Center>,
  pins: Array as PropType<Pin[]>,
  stream: Object as PropType<StreamPins>,
});
const center = props.center as Center;
const colorMap = {
  red: { main: "orangered", sub: "firebrick" },
  blue: { main: "dodgerblue", sub: "royalblue" },
  green: { main: "limegreen", sub: "forestgreen" },
  yellow: { main: "gold", sub: "goldenrod" },
};
let pins: Pin[] = [];
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

const initMap = async () => {
  const { Map } = await loadeMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;
  map = new Map(mapElement, {
    center: center,
    zoom: 12,
    mapId: process.env.VUE_APP_MAP_ID,
  });
};

const initPins = async () => {
  const { PinElement, AdvancedMarkerElement } = await loadeMapsLibrary();
  pins = props.pins as Pin[];
  for (let pin of pins) {
    const customPin = new PinElement(customPinColor(pin.color));
    const marker = new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
    });
    // マーカーを操作するために保存する。pinsと2重管理になる
    markers.push(marker);
  }
};

const removePin = async (id: string) => {
  // 配置したピンを削除するには marker.map = null とする必要がある
  // markerはidを持たないため、pinsからidを取得して特定する
  const i = pins.findIndex((pin) => pin.id === id);
  markers[i].map = null;
  // 削除したpinsを取り除く
  // markerも同期させる必要があるため合わせて削除
  pins.splice(i, 1);
  markers.splice(i, 1);
};

const insertPin = async (item: Pin) => {
  const { PinElement, AdvancedMarkerElement } = await loadeMapsLibrary();
  const customPin = new PinElement(customPinColor(item.color));
  const marker = new AdvancedMarkerElement({
    position: item.position,
    map: map,
    content: customPin.element,
  });
  // pinsとmarkersは同期させる必要があるので合わせて追加
  pins.push(item);
  markers.push(marker);
};

const modifyPin = async (id: string, item: Pin) => {
  removePin(id);
  insertPin(item);
};

const updatePins = async (stream: StreamPins) => {
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
  // ピンはAPIから取得すためonUpdatedで初期化する
  if (!props.stream) await initPins();
  // Pinの更新がある度にprops.streamを受け取り再描画する
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
