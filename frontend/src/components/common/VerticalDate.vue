<script setup lang="ts">
import { computed } from "vue";

const verticalDate = computed(() => {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" });
  const day = now.getDate();
  const year = now.getFullYear();
  const suffix = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `( ${month}. ${day}${suffix(day)}. ${year}. )`;
});
</script>

<template>
  <time
    :datetime="new Date().toISOString().split('T')[0]"
    class="fixed right-4 top-1/2 -translate-y-1/2 z-20 text-[10px] tracking-[0.2em] text-stone-600 dark:text-stone-600 select-none pointer-events-none"
    style="writing-mode: vertical-rl; text-orientation: mixed"
    aria-hidden="true"
  >
    {{ verticalDate }}
  </time>
</template>
