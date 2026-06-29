<script setup lang="ts">
// Route
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<template>
  <div class="w-full mb-6 sm:mb-7 lg:mb-12">
    <h1 class="text-2xl font-bold mb-0.5 text-primary">
      {{ $t(`auth.${String(route.name)}.title`) }}
    </h1>
    <p class="text-sm text-stone-600">
      {{ $t(`auth.${String(route.name)}.description`) }}
    </p>
  </div>
</template>
