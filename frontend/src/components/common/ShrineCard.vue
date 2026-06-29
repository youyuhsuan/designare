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
  <div
    class="group flex flex-col border-2 border-stone-500 dark:border-stone-500 p-1.5 hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-300"
  >
    <div
      class="flex flex-col flex-1 border border-stone-500 dark:border-stone-500 group-hover:border-primary-500 dark:group-hover:border-primary-500 transition-colors duration-300"
    >
      <!-- Image mat -->
      <div class="h-56 p-2.5 bg-stone-100 dark:bg-stone-100">
        <Image
          :loading="index <= 6 ? 'eager' : 'lazy'"
          :imageUrl="shrine.imageUrl"
          :name="shrine.name"
          :imageWrapperClass="'w-full h-full'"
          :imageClass="'w-full h-full object-cover'"
        />
      </div>

      <!-- Info -->
      <div
        class="flex flex-col items-center gap-1.5 text-center border-t border-stone-500 dark:border-stone-500 group-hover:border-primary-500 dark:group-hover:border-primary-500 transition-colors duration-300 px-3 py-3"
      >
        <p
          class="font-medium text-stone-700 dark:text-stone-700 tracking-wider transition-colors group-hover:text-primary-500"
        >
          {{ shrine.name }}
        </p>
        <p
          class="text-[10px] tracking-[0.2em] text-stone-400 dark:text-stone-400 uppercase"
        >
          {{ formatAddress(shrine) }}
        </p>
      </div>
    </div>
  </div>
</template>
