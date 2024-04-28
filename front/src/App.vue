<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import GoogleMap, { Center, Pin, ColorCode } from "./components/GoogleMap.vue";
import PinList from "./components/PinList.vue";

interface DynamoDbItem {
  group: { S: string };
  id: { S: string };
  name: { S: string };
  position: {
    M: {
      lng: { N: string };
      lat: { N: string };
    };
  };
  color: { S: ColorCode };
}

const center: Center = { lat: 35.6812362, lng: 139.7645445 };
const pins = ref<Pin[]>([]);
const socket = ref<WebSocket | null>(null);

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

const insertPin = (item: DynamoDbItem) => {
  const newPin = converteDbItemToPin(item);
  const newPins = [...pins.value, newPin];
  pins.value = newPins;
};

const modifyPin = (item: DynamoDbItem) => {
  const modifiedPin = converteDbItemToPin(item);
  const modifedPins = pins.value.map((pin) => {
    if (pin.id === modifiedPin.id) return modifiedPin;
    return pin;
  });
  pins.value = modifedPins;
};

const removePin = (id: string) => {
  pins.value = pins.value.filter((pin) => pin.id !== id);
};

const updatePins = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data.operation === "INSERT") insertPin(data.item);
  if (data.operation == "MODIFY") modifyPin(data.item);
  if (data.operation == "REMOVE") removePin(data.key.id.S);
};

const connectWebSocket = () => {
  const url = process.env.VUE_APP_WEBSOCKET_URL;
  socket.value = new WebSocket(url);
  socket.value.onmessage = (event) => updatePins(event);
};

onMounted(async () => {
  const url = process.env.VUE_APP_DATA_API_URL;
  const res = await fetch(url).catch((err) => console.error(err));
  if (!res) return;
  const dynamoDabData = await res.json();
  const pinsData = converteDbDataToPinsData(dynamoDabData);
  pins.value = pinsData;
  connectWebSocket();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <GoogleMap :center="center" :pins="pins" />
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
