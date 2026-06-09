<script lang="ts" setup>
// Types
import type { Shrine } from "@/types/shrinesType";
// Components
import Image from "@/components/common/Image.vue";
// Utils
import { formatAddress } from "@/utils/formatUI";

defineProps<{ shrine: Shrine; index: number }>();
</script>

<template>
  <div class="flex flex-col group">
    <div
      class="relative h-64 mb-4 border-stone-200 dark:border-stone-200 border-2 hover:border-primary-500 hover:shadow-[0_0_0_4px_primary-500] transition-[border-color,box-shadow] duration-300 ease-in-out"
    >
      <!-- Image -->
      <Image
        :loading="index <= 6 ? 'eager' : 'lazy'"
        :imageUrl="shrine.imageUrl"
        :name="shrine.name"
        :imageClass="'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'"
      />
    </div>

    <!-- Info -->
    <div class="flex flex-col px-1 gap-1">
      <p
        class="font-medium text-stone-600 dark:text-stone-600 tracking-wide transition-colors group-hover:text-primary-500"
      >
        {{ shrine.name }}
      </p>
      <p class="text-[10px] text-stone-400 dark:text-stone-400">
        {{ formatAddress(shrine) }}
      </p>
    </div>
  </div>
</template>
