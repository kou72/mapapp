<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Pin } from "@/types/map-interfaces";
import ListSubheader from "@/components/ui/ListSubheader.vue";
import ListItemWithButtons from "@/components/ui/ListItemWithButtons.vue";

const props = defineProps({
  pins: Array as PropType<Pin[]>,
});

const groupedPins = () => {
  const groups: { [key: string]: Pin[] } = {};
  props.pins?.forEach((pin) => {
    if (!groups[pin.group]) groups[pin.group] = [];
    groups[pin.group].push(pin);
  });
  return groups;
};

const removePin = async (pinId: string) => {
  try {
    console.log(`Deleting pin with id: ${pinId}`);
    const url = process.env.VUE_APP_REST_API_URL + "delete";
    const request = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pinId }),
    };
    const response = await fetch(url, request);
    console.log(response);
  } catch (err) {
    console.error(err);
    alert("削除に失敗しました");
  }
};
</script>

<template>
  <v-list class="rounded">
    <div v-for="(group, groupName) in groupedPins()" :key="groupName">
      <ListSubheader :text="`タイプ：${groupName}`" />
      <div v-for="pin in group" :key="pin.id">
        <ListItemWithButtons
          :title="pin.name"
          :subTitle1="`緯度：${pin.position!.lat}`"
          :subTitle2="`経度：${pin.position!.lng}`"
          btnIcon1="mdi-pencil"
          btnIcon2="mdi-delete"
          @delete="removePin(pin.id)"
        />
      </div>
    </div>
  </v-list>
</template>

<style>
.v-list {
  padding: 0;
}
</style>
