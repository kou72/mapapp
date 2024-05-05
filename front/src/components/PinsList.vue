<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Pin } from "@/types/map-interfaces";

const props = defineProps({
  pins: Array as PropType<Pin[]>,
});

const groupedPins = () => {
  const groups: { [key: string]: Pin[] } = {};
  props.pins?.forEach((pin) => {
    if (!groups[pin.group]) {
      groups[pin.group] = [];
    }
    groups[pin.group].push(pin);
  });
  return groups;
};
</script>

<template>
  <v-card>
    <v-list>
      <template v-for="(group, groupName) in groupedPins()" :key="groupName">
        <v-subheader>{{ groupName }}</v-subheader>
        <v-list-item-group>
          <v-list-item v-for="pin in group" :key="pin.id">
            <v-list-item-content>
              {{ pin.name }}
              緯度：{{ pin.position!.lat }} 経度：{{ pin.position!.lng }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
      </template>
    </v-list>
  </v-card>
</template>
