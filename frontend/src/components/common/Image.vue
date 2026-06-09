<script setup lang="ts">
import { ref } from "vue";

const hasError = ref<boolean>(false);
const props = withDefaults(
  defineProps<{
    imageUrl: string;
    name: string;
    imageClass?: string;
    imageWrapperClass?: string;
    errorClass?: string;
    loading?: "lazy" | "eager";
  }>(),
  {
    imageWrapperClass: "w-full h-full",
    imageClass: "w-full h-full object-cover",
    errorClass: "text-white/60 dark:text-white/60",
    loading: "eager",
  },
);
const isLoading = ref<boolean>(!!props.imageUrl);
</script>

<template>
  <div
    class="overflow-hidden flex items-center justify-center"
    :class="imageWrapperClass"
  >
    <!-- Skeleton -->
    <Skeleton v-if="isLoading" height="100%" width="100%" borderRadius="0" />

    <!-- Image -->
    <img
      v-if="imageUrl && !hasError"
      :class="[imageClass, { invisible: isLoading }]"
      :src="imageUrl"
      :alt="name"
      :loading="loading"
      @error="
        hasError = true;
        isLoading = false;
      "
      @load="isLoading = false"
    />

    <!-- Error -->
    <i v-if="hasError" class="pi pi-image !text-6xl" :class="errorClass" />
  </div>
</template>
