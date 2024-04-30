<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { Pin } from "@/types/map-interfaces";

const props = defineProps({
  pins: Array as PropType<Pin[]>,
});
</script>

<template>
  <v-card>
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="pin in props.pins" :key="pin.id">
          <v-list-item-content>
            {{ pin.group }}
            {{ pin.name }}
            緯度：{{ pin.position.lat }} 経度：{{ pin.position.lng }}
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
