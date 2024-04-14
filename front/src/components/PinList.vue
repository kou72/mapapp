<script setup lang="ts">
import { defineProps } from "vue";
import { Pin } from "./GoogleMap.vue";

const props = defineProps({
  pins: Array,
});

const pins = props.pins as Pin[];
</script>

<template>
  <v-card>
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="pin in pins" :key="pin.id">
          <v-list-item-content>
            {{ pin.group }}
            {{ pin.name }}
            緯度：{{ pin.position.lat }} 軽度：{{ pin.position.lng }}
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
