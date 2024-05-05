<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Center, Pin, PinStream } from "@/types/map-interfaces";
import {
  converteDdbPinsToPins,
  converteDdbStreamToPinStream,
} from "@/utils/dynamodbPinConverter";
import MultiPinsGoogleMap from "@/components/MultiPinsGoogleMap.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import PinsList from "@/components/PinsList.vue";

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const pins = ref<Pin[]>([]);
const socket = ref<WebSocket | null>(null);
const stream = ref<PinStream>();
const router = useRouter();
const goAboutPage = () => router.push("/put");

const getPinsData = async () => {
  const url = process.env.VUE_APP_REST_API_URL;
  const res = await fetch(url).catch((err) => console.error(err));
  if (!res) return;
  const dynamoDabData = await res.json();
  const pinsData = converteDdbPinsToPins(dynamoDabData);
  pins.value = pinsData;
};

const connectWebSocket = () => {
  const url = process.env.VUE_APP_WEBSOCKET_URL;
  socket.value = new WebSocket(url);
  socket.value.onmessage = (dbStream) => {
    // pinsを上書きして更新するとMAP全体が再描画される
    // 無駄な描画を防ぐため更新要素のみコンポーネントに渡し処理は任せる
    const pinStream = converteDdbStreamToPinStream(dbStream);
    stream.value = pinStream;
  };
};

onMounted(async () => {
  await getPinsData();
  connectWebSocket();
});
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <MultiPinsGoogleMap :center="center" :pins="pins" :stream="stream" />
    </v-col>
    <v-col cols="4" class="text-center">
      <FlatButton text="ピンの追加" :func="goAboutPage" class="my-4" />
      <!-- 高さを制限してスクロールするように -->
      <div style="height: 80vh" class="overflow-auto">
        <PinsList :pins="pins" />
      </div>
    </v-col>
  </v-row>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Arial", "Hiragino Sans", "ヒラギノ角ゴシック", sans-serif;
}
</style>
