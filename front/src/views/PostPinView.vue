<script setup lang="ts">
import { ref, onUpdated } from "vue";
import { ColorCode, Pin } from "@/types/map-interfaces";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import SearchField from "@/components/ui/SearchField.vue";
import TextField from "@/components/ui/TextField.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import OutlinedButton from "@/components/ui/OutlinedButton.vue";
import "@mdi/font/css/materialdesignicons.css";

const pin = ref<Pin>({
  id: "",
  name: "",
  group: "",
  color: "red",
  position: { lat: 0, lng: 0 },
});
const searchInput = ref("");
const loading = ref(false);
// DraggableMarkerPlacementMapからexportされたsetPin()を取得する
const mapRef = ref();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setPinValue = (data: any) => {
  const location = data.results[0].geometry.location;
  const newPin = {
    id: "",
    name: searchInput.value,
    group: "",
    color: "blue" as ColorCode,
    position: { lat: location.lat, lng: location.lng },
  };
  pin.value = newPin;
  // 子コンポーネントのsetPin()を呼び出す
  mapRef.value.setPin(newPin);
};

const search = async () => {
  const url = "https://maps.googleapis.com/maps/api/geocode/json";
  loading.value = true;
  const res = await fetch(
    `${url}?address=${searchInput.value}&key=${process.env.VUE_APP_MAPS_API_KEY}`
  );
  const data = await res.json();
  if (data.status === "OK") setPinValue(data);
  loading.value = false;
};

const onRegister = () => {
  // 登録ボタンがクリックされたときの処理
  console.log("Register:", pin.value);
};

onUpdated(() => {
  console.log("Pin:", pin.value);
});
</script>

<template>
  <v-row class="ma-2">
    <!-- Googleマップ -->
    <v-col cols="8">
      <DraggableMarkerPlacementMap v-model:parentPin="pin" ref="mapRef" />
    </v-col>
    <v-col cols="4" class="mt-4">
      <!-- 検索用テキストフィールド -->
      <SearchField v-model="searchInput" :loading="loading" :func="search" />
      <!-- ピンの要素 -->
      <div class="mx-4 mt-12 mb-16">
        <TextField label="名前" v-model="pin.name" />
        <v-row class="py-3">
          <v-col cols="6">
            <TextField label="緯度" v-model="pin.position.lat" />
          </v-col>
          <v-col cols="6">
            <TextField label="経度" v-model="pin.position.lng" />
          </v-col>
        </v-row>
        <TextField label="タイプ" v-model="pin.group" />
      </div>
      <!-- ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="onRegister" class="mr-2" />
        <FlatButton text="登録" :func="onRegister" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
