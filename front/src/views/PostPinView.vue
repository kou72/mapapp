<script setup lang="ts">
import { ref } from "vue";
import { Pin } from "@/types/map-interfaces";
import DraggableMarkerPlacementMap from "@/components/DraggableMarkerPlacementMap.vue";
import SearchField from "@/components/ui/SearchField.vue";
import TextField from "@/components/ui/TextField.vue";
import FlatButton from "@/components/ui/FlatButton.vue";
import OutlinedButton from "@/components/ui/OutlinedButton.vue";
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
    <!-- Googleマップ -->
    <v-col cols="8">
      <DraggableMarkerPlacementMap :pin="pin" />
    </v-col>
    <v-col cols="4" class="mt-4">
      <!-- 検索用テキストフィールド -->
      <SearchField :modelValue="inputText" :loading="loading" :func="onClick" />
      <!-- ピンの要素 -->
      <div class="mx-4 mt-12 mb-16">
        <TextField label="名前" v-model="name" />
        <v-row class="my-4">
          <v-col cols="6">
            <TextField label="緯度" v-model="latitude" />
          </v-col>
          <v-col cols="6">
            <TextField label="経度" v-model="longitude" />
          </v-col>
        </v-row>
        <TextField label="タイプ" v-model="type" />
      </div>
      <!-- ボタン -->
      <v-row justify="end" class="mx-4">
        <OutlinedButton text="キャンセル" :func="onRegister" class="mr-2" />
        <FlatButton text="登録" :func="onRegister" class="ml-2" />
      </v-row>
    </v-col>
  </v-row>
</template>
