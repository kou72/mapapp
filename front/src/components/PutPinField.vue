<script setup lang="ts">
import { ref, onUpdated, defineProps, PropType, defineEmits } from "vue";
import { ColorCode, Pin } from "@/types/map-interfaces";
import TextField from "@/components/ui/TextField.vue";
import SelectField from "@/components/ui/SelectField.vue";

const props = defineProps({
  parentPin: { type: Object as PropType<Pin>, required: true },
  updateGroupFild: { type: Function, required: true },
});

// テキストフィールドの値が変更されたときに親コンポーネントに通知する
const emit = defineEmits(["update:pin"]);

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

const pinRef = ref(props.parentPin);

const setPinName = () => {
  emit("update:pin", pinRef.value);
};

const setPinColor = () => {
  pinRef.value.color = selectColorWithGroup(pinRef.value.group);
  emit("update:pin", pinRef.value);
  props.updateGroupFild();
};

onUpdated(() => {
  pinRef.value = props.parentPin;
});
</script>

<template>
  <!-- ピンの要素 -->
  <div class="mx-4 mt-12 mb-16">
    <TextField label="名前" v-model="pinRef.name" :inputfunc="setPinName" />
    <v-row class="py-3">
      <v-col cols="6">
        <!-- pin.positionがundefinedの場合はv-modelを使用しない -->
        <TextField label="緯度" v-if="!pinRef.position" />
        <TextField label="緯度" v-else v-model="pinRef.position.lat" />
      </v-col>
      <v-col cols="6">
        <!-- pin.positionがundefinedの場合はv-modelを使用しない -->
        <TextField label="経度" v-if="!pinRef.position" />
        <TextField label="経度" v-else v-model="pinRef.position.lng" />
      </v-col>
    </v-row>
    <SelectField
      label="グループ"
      v-model="pinRef.group"
      :selectfunc="setPinColor"
    />
  </div>
</template>
