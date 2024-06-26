<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Pin, ColorCode, Position } from "@/types/map-interfaces";
import { convertPinToDdbPin } from "@/utils/dynamodbPinConverter";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import SearchField from "@/components/ui/SearchField.vue";
import PutPinField from "@/components/PutPinField.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import OutlinedButton from "@/components/ui/OutlinedButton.vue";

const router = useRouter();
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: false },
  group: { type: String, required: false },
  color: { type: String, required: false },
  lat: { type: String, required: false },
  lng: { type: String, required: false },
});
const pin = ref<Pin>({
  id: props.id,
  name: props.name || "",
  group: props.group || "赤",
  color: (props.color as ColorCode) || "red",
});
const searchInput = ref("");
const loading = ref(false);
const goTopView = () => router.push("/");
// コンポーネントからexposeされた関数を取得する
const mapRef = ref();
const setMapPinPosition = () =>
  mapRef.value.updatePinPosition(pin.value.position);
const setMapPinColor = () => mapRef.value.updatePinColor(pin.value.color);

const geocode = async () => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchInput.value}&key=${process.env.VUE_APP_MAPS_API_KEY}`;
    loading.value = true;
    const res = await fetch(url);
    const data = await res.json();
    loading.value = false;
    // ジオコーディング結果でピンの位置を更新
    pin.value.name = searchInput.value;
    pin.value.position = data.results[0].geometry.location as Position;
    setMapPinPosition();
  } catch (err) {
    console.error(err);
    alert("検索に失敗しました");
  }
};

const insertPin = async () => {
  try {
    const ddbPin = convertPinToDdbPin(pin.value);
    const url = process.env.VUE_APP_REST_API_URL + "put";
    const request = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ddbPin),
    };
    const response = await fetch(url, request);
    console.log(response);
    goTopView();
  } catch (err) {
    console.error(err);
    alert("登録に失敗しました");
  }
};

onMounted(() => {
  if (props.lat && props.lng) {
    pin.value.position = {
      lat: parseFloat(props.lat),
      lng: parseFloat(props.lng),
    };
    setMapPinPosition();
  }
});
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <!-- Googleマップ -->
      <DraggableMarkerPlacementMap
        v-model:parentPinPosition="pin.position"
        v-model:parentPinColor="pin.color"
        ref="mapRef"
      />
    </v-col>
    <v-col cols="4" class="mt-4">
      <!-- 検索用テキストフィールド -->
      <SearchField
        v-model:searchInput="searchInput"
        :loading="loading"
        :clickSearchIcon="geocode"
      />
      <!-- ピン用テキストフィールド -->
      <PutPinField v-model:parentPin="pin" :updateGroupFild="setMapPinColor" />
      <!-- 登録ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="goTopView" class="mr-2" />
        <FlatButton text="登録" :func="insertPin" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
