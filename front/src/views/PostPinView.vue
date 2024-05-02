<script setup lang="ts">
import { ref } from "vue";
import { Pin } from "@/types/map-interfaces";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import "@mdi/font/css/materialdesignicons.css";
const pin: Pin = {
  id: "",
  name: "",
  group: "",
  color: "red",
  position: { lat: 35.6812362, lng: 139.7645445 },
};

const inputText = ref("");
const loading = ref(false);
const name = ref("");
const latitude = ref("");
const longitude = ref("");
const type = ref("");

const onClick = async () => {
  console.log(inputText.value);
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  loading.value = false;
};

const onRegister = () => {
  // 登録ボタンがクリックされたときの処理
  console.log("Name:", name.value);
  console.log("Latitude:", latitude.value);
  console.log("Longitude:", longitude.value);
  console.log("Type:", type.value);
};
</script>

<template>
  <v-row class="ma-2">
    <v-col cols="8">
      <DraggableMarkerPlacementMap :pin="pin" />
    </v-col>
    <v-col cols="4">
      <v-spacer class="pt-4"></v-spacer>
      <v-text-field
        :loading="loading"
        append-inner-icon="mdi-magnify"
        label="マップを検索する"
        density="compact"
        variant="outlined"
        hide-details
        color="grey"
        single-line
        rounded="xl"
        @click:append-inner="onClick"
      ></v-text-field>
      <v-spacer class="pt-12"></v-spacer>
      <div class="mx-4">
        <v-label>名前</v-label>
        <v-text-field
          v-model="name"
          variant="outlined"
          density="compact"
          hide-details
          single-line
          color="grey"
        ></v-text-field>
        <v-spacer class="pt-4"></v-spacer>
        <v-row>
          <v-col cols="6">
            <v-label>緯度</v-label>
            <v-text-field
              v-model="latitude"
              variant="outlined"
              density="compact"
              hide-details
              single-line
              color="grey"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-label>経度</v-label>
            <v-text-field
              v-model="longitude"
              variant="outlined"
              density="compact"
              hide-details
              single-line
              color="grey"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-spacer class="pt-4"></v-spacer>
        <v-label>タイプ</v-label>
        <v-text-field
          v-model="type"
          variant="outlined"
          density="compact"
          hide-details
          single-line
          color="grey"
        ></v-text-field>
        <v-spacer class="pt-16"></v-spacer>
      </div>
      <v-row justify="end" class="mx-4">
        <v-btn
          color="light-blue"
          variant="outlined"
          rounded
          elevation="0"
          @click="onRegister"
          class="mr-2 px-2"
          >キャンセル</v-btn
        >
        <v-btn
          color="light-blue"
          rounded
          elevation="0"
          @click="onRegister"
          class="ml-2 px-2"
          >登録</v-btn
        >
      </v-row>
    </v-col>
  </v-row>
</template>
