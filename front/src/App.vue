<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const converteDbDataToPinsData = (dynamoDbData: DynamoDbItem[]) => {
  const data: Pin[] = dynamoDbData.map((item: DynamoDbItem) => {
    const pin: Pin = {
      id: parseInt(item.id.S),
      name: item.name.S,
      group: item.group.S,
      color: item.color.S,
      position: {
        lat: parseFloat(item.position.M.lat.N),
        lng: parseFloat(item.position.M.lng.N),
      },
    };
    return pin;
  });
  return data;
};

onMounted(async () => {
  const url = process.env.VUE_APP_DATA_API_URL;
  const res = await fetch(url).catch((err) => console.error(err));
  if (!res) return;
  const dynamoDabData = await res.json();
  const pinsData = converteDbDataToPinsData(dynamoDabData);
  pins.value = pinsData;
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
