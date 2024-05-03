<script setup lang="ts">
/*global google*/
/*eslint no-undef: "error"*/
import { defineProps, PropType, onMounted, onUpdated } from "vue";
import { Center, Pin, PinStream } from "@/types/map-interfaces";
import { customPinsColor } from "@/utils/customPinsColor";
import { loadeGoogleMapsLibrary } from "@/utils/loadeGoogleMapsLibrary";

const props = defineProps({
  center: { type: Object as PropType<Center>, required: true },
  pins: { type: Array as PropType<Pin[]>, required: true },
  stream: Object as PropType<PinStream>,
});
let pins: Pin[] = [];
let map: google.maps.Map;
let markers: google.maps.marker.AdvancedMarkerElement[] = [];

const initMap = async () => {
  const { Map } = await loadeGoogleMapsLibrary();
  const mapElement = document.getElementById("map") as HTMLElement;
  map = new Map(mapElement, {
    center: props.center,
    zoom: 12,
    draggableCursor: "default",

    // 高度なマーカーを使用するためにmapIdの取得が必要
    mapId: process.env.VUE_APP_MAP_ID,
  });
};

const initPins = async () => {
  const { PinElement, AdvancedMarkerElement } = await loadeGoogleMapsLibrary();
  pins = props.pins;
  for (let pin of pins) {
    const customPin = new PinElement(customPinsColor(pin.color));
    const marker = new AdvancedMarkerElement({
      position: pin.position,
      map: map,
      content: customPin.element,
    });
    // markers.pushしなくても描画されるが、マーカー操作に必要なため保存する
    // pins[]と整合性が取れるように管理する
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
  const customPin = new PinElement(customPinsColor(item.color));
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
