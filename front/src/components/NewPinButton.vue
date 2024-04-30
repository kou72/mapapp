<script setup lang="ts">
const click = () => {
  console.log("クリック");
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
