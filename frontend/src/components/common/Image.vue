<script setup lang="ts">
import { ref } from "vue";
const hasError = ref<boolean>(false);

defineProps<{
  imageUrl: string;
  name: string;
}>();
</script>

<template>
  <div class="w-full h-full overflow-hidden flex items-center justify-center">
    <img
      v-if="imageUrl && !hasError"
      class="w-full h-full object-cover"
      :src="imageUrl"
      :alt="name"
      @error="hasError = true"
    />
    <i v-else class="pi pi-image text-7xl text-stone-300 dark:text-stone-300" />
  </div>
</template>
