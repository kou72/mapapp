<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const click = () => {
  router.push("/about");
};
</script>

<template>
  <v-btn
    class="mx-2 my-2"
    color="light-blue"
    rounded
    elevation="0"
    @click="click"
  >
    ピンの追加
  </v-btn>
</template>
