<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Center, Pin, DynamoDbItem, PinStream } from "@/types/map-interfaces";
import GoogleMap from "./components/GoogleMap.vue";
import PinList from "./components/PinList.vue";

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const pins = ref<Pin[]>([]);
const socket = ref<WebSocket | null>(null);
const stream = ref<PinStream>();

const converteDbItemToPin = (item: DynamoDbItem): Pin => {
  const pin: Pin = {
    id: item.id.S,
    name: item.name.S,
    group: item.group.S,
    color: item.color.S,
    position: {
      lat: parseFloat(item.position.M.lat.N),
      lng: parseFloat(item.position.M.lng.N),
    },
  };
  return pin;
};

const converteDbDataToPinsData = (dynamoDbData: DynamoDbItem[]) => {
  const data: Pin[] = dynamoDbData.map((item: DynamoDbItem) => {
    return converteDbItemToPin(item);
  });
  return data;
};

const converteDbStreamToPinStream = (dbStream: MessageEvent) => {
  const data = JSON.parse(dbStream.data);
  const pinStream: PinStream = {
    operation: data.operation,
    item: data.item ? converteDbItemToPin(data.item) : undefined,
    id: data.key.id.S,
  };
  return pinStream;
};

const connectWebSocket = () => {
  const url = process.env.VUE_APP_WEBSOCKET_URL;
  socket.value = new WebSocket(url);
  socket.value.onmessage = (dbStream) => {
    // pinsを上書きして更新するとMAP全体が再描画される
    // 無駄な描画を防ぐため更新要素のみGoogleMap.Vueに渡し処理は任せる
    const pinStream = converteDbStreamToPinStream(dbStream);
    stream.value = pinStream;
  };
};

onMounted(async () => {
  const url = process.env.VUE_APP_REST_API_URL;
  const res = await fetch(url).catch((err) => console.error(err));
  if (!res) return;
  const dynamoDabData = await res.json();
  const pinsData = converteDbDataToPinsData(dynamoDabData);
  pins.value = pinsData;
  connectWebSocket();
});
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <GoogleMap :center="center" :pins="pins" :stream="stream" />
    </v-col>
    <v-col cols="4" class="align-center">
      <PinList :pins="pins"></PinList>
    </v-col>
  </v-row>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
