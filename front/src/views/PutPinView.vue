<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ColorCode, Pin } from "@/types/map-interfaces";
import { convertPinToDdbPin } from "@/utils/dynamodbPinConverter";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import SearchField from "@/components/ui/SearchField.vue";
import PutPinField from "@/components/PutPinField.vue";
import TextField from "@/components/ui/TextField.vue";
import SelectField from "@/components/ui/SelectField.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import OutlinedButton from "@/components/ui/OutlinedButton.vue";

const generateId = () => {
  // ランダムな文字列+現在時刻を使用
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

const pin = ref<Pin>({
  id: generateId(),
  name: "",
  group: "赤",
  color: "red",
  position: undefined,
});
const searchInput = ref("");
const loading = ref(false);
const router = useRouter();
const goTopView = () => router.push("/");
// コンポーネントからexposeされた関数などを取得する
const mapRef = ref();

const setPinName = () => {
  return searchInput.value ? searchInput.value : pin.value.name;
};

const selectColorWithGroup = (group: string) => {
  let color: ColorCode;
  if (group === "赤") color = "red";
  else if (group === "青") color = "blue";
  else if (group === "緑") color = "green";
  else if (group === "黄") color = "yellow";
  // 指定の文字でない場合は赤色にする
  else color = "red";
  return color;
};

const setMapPin = () => {
  pin.value = {
    id: pin.value.id,
    name: setPinName(),
    group: pin.value.group,
    color: selectColorWithGroup(pin.value.group),
    position: pin.value.position,
  };
  // 子コンポーネントのsetPin()を呼び出す
  mapRef.value.setPin(pin.value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setPinPosition = (position: any) => {
  pin.value.position = {
    lat: position.lat,
    lng: position.lng,
  };
};

const geocode = async () => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchInput.value}&key=${process.env.VUE_APP_MAPS_API_KEY}`;
  loading.value = true;
  const res = await fetch(url).catch((err) => console.error(err));
  if (!res) return;
  const data = await res.json();
  loading.value = false;
  if (data.status !== "OK") return alert("検索に失敗しました");
  setPinPosition(data.results[0].geometry.location);
  setMapPin();
};

const insertPin = async () => {
  const ddbPin = convertPinToDdbPin(pin.value);
  const url = process.env.VUE_APP_REST_API_URL;
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ddbPin),
    // eslint-disable-next-line no-undef
    mode: "no-cors" as RequestMode,
  };
  const response = await fetch(url, request).catch((err) => console.error(err));
  console.log(response);
  if (!response) return alert("登録に失敗しました");
  goTopView();
};
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
      <!-- ピン用テキストフィールド -->
      <PutPinField
        v-model:parentPin="pin"
        :setPin="setMapPin"
        :setPinName="setPinName"
      />
      <!-- ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="goTopView" class="mr-2" />
        <FlatButton text="登録" :func="insertPin" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
