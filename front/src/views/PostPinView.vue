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
const nameField = ref("");
const latField = ref(0);
const lngField = ref(0);
const typeField = ref("");
const colorField = ref<ColorCode>("red");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const copyToPinValue = (data: any) => {
  nameField.value = searchInput.value;
  searchInput.value = "";
  const location = data.results[0].geometry.location;
  latField.value = location.lat;
  lngField.value = location.lng;

  const newPin = {
    id: "",
    name: nameField.value,
    group: "",
    color: colorField.value,
    position: { lat: location.lat, lng: location.lng },
  };
  pin.value = newPin;
};

const search = async () => {
  const url = "https://maps.googleapis.com/maps/api/geocode/json";
  loading.value = true;
  const res = await fetch(
    `${url}?address=${searchInput.value}&key=${process.env.VUE_APP_MAPS_API_KEY}`
  );
  const data = await res.json();
  console.log(data);
  if (data.status === "OK") copyToPinValue(data);
  loading.value = false;
};

const onRegister = () => {
  // 登録ボタンがクリックされたときの処理
  console.log("Name:", nameField.value);
  console.log("Latitude:", latField.value);
  console.log("Longitude:", lngField.value);
  console.log("Type:", typeField.value);
  console.log("SearchText:", searchInput.value);
  console.log("pin:", pin.value);
};

onUpdated(() => {
  console.log("Pin:", pin.value);
});
</script>

<template>
  <v-row class="ma-2">
    <!-- Googleマップ -->
    <v-col cols="8">
      <DraggableMarkerPlacementMap v-model:pin="pin" />
    </v-col>
    <v-col cols="4" class="mt-4">
      <!-- 検索用テキストフィールド -->
      <SearchField v-model="searchInput" :loading="loading" :func="search" />
      <!-- ピンの要素 -->
      <div class="mx-4 mt-12 mb-16">
        <TextField label="名前" v-model="nameField" />
        <v-row class="py-3">
          <v-col cols="6">
            <TextField label="緯度" v-model="latField" />
          </v-col>
          <v-col cols="6">
            <TextField label="経度" v-model="lngField" />
          </v-col>
        </v-row>
        <TextField label="タイプ" v-model="typeField" />
      </div>
      <!-- ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="onRegister" class="mr-2" />
        <FlatButton text="登録" :func="onRegister" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
