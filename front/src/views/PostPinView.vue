<script setup lang="ts">
import { ref, onUpdated } from "vue";
import { ColorCode, Pin } from "@/types/map-interfaces";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import SearchField from "@/components/ui/SearchField.vue";
import TextField from "@/components/ui/TextField.vue";
import SelectField from "@/components/ui/SelectField.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import OutlinedButton from "@/components/ui/OutlinedButton.vue";
import "@mdi/font/css/materialdesignicons.css";

const pin = ref<Pin>({
  id: "",
  name: "",
  group: "赤",
  color: "red",
  position: undefined,
});
const searchInput = ref("");
const loading = ref(false);
// DraggableMarkerPlacementMapからexportされたsetPin()を取得する
const mapRef = ref();

const selectColorWithGroup = (group: string) => {
  let color: ColorCode;
  if (group === "赤") color = "red";
  else if (group === "青") color = "blue";
  else if (group === "緑") color = "green";
  else if (group === "黄色") color = "yellow";
  // 未選択の場合は赤色にする
  else color = "red";
  return color;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setPinPosition = (position: any) => {
  pin.value.position = {
    lat: position.lat,
    lng: position.lng,
  };
};

const setMapPin = () => {
  pin.value = {
    id: "",
    name: searchInput.value,
    group: pin.value.group,
    color: selectColorWithGroup(pin.value.group),
    position: pin.value.position,
  };
  // 子コンポーネントのsetPin()を呼び出す
  mapRef.value.setPin(pin.value);
};

const geocode = async () => {
  const url = "https://maps.googleapis.com/maps/api/geocode/json";
  loading.value = true;
  const res = await fetch(
    `${url}?address=${searchInput.value}&key=${process.env.VUE_APP_MAPS_API_KEY}`
  );
  const data = await res.json();
  loading.value = false;
  if (data.status !== "OK") return;
  setPinPosition(data.results[0].geometry.location);
  setMapPin();
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
      <SearchField v-model="searchInput" :loading="loading" :func="geocode" />
      <!-- ピンの要素 -->
      <div class="mx-4 mt-12 mb-16">
        <TextField label="名前" v-model="pin.name" />
        <v-row class="py-3">
          <v-col cols="6">
            <!-- pin.positionがundefinedの場合はv-modelを使用しない -->
            <TextField label="緯度" v-if="!pin.position" />
            <TextField label="緯度" v-else v-model="pin.position.lat" />
          </v-col>
          <v-col cols="6">
            <!-- pin.positionがundefinedの場合はv-modelを使用しない -->
            <TextField label="経度" v-if="!pin.position" />
            <TextField label="経度" v-else v-model="pin.position.lng" />
          </v-col>
        </v-row>
        <SelectField
          label="タイプ"
          v-model="pin.group"
          :selectfunc="setMapPin"
        />
      </div>
      <!-- ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="onRegister" class="mr-2" />
        <FlatButton text="登録" :func="onRegister" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
