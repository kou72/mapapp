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
