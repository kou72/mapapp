<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  func: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value: string) => {
  emit("update:modelValue", value);
};

const onClick = () => {
  if (!props.func) return;
  props.func();
};

const appendIcon = computed(() => {
  return !props.loading ? "mdi-magnify" : "";
});
</script>

<template>
  <v-text-field
    :model-value="props.modelValue"
    @input="updateValue($event.target.value)"
    label="マップを検索する"
    density="compact"
    variant="outlined"
    hide-details
    color="grey"
    single-line
    rounded="xl"
  >
    <template v-slot:append-inner>
      <v-progress-circular
        v-if="props.loading"
        indeterminate
        color="light-blue"
        size="20"
        width="2"
      ></v-progress-circular>
      <v-icon v-else :icon="appendIcon" @click="onClick"></v-icon>
    </template>
  </v-text-field>
</template>
