<script setup lang="ts">
import { computed } from "vue";

const isMobileMenuOpen = defineModel<boolean>("isMobileMenuOpen");

// SVG transform & opacity computeds for hamburger menu animation
const upLineTransform = computed(() =>
  isMobileMenuOpen.value ? "translate(0, -4.25) rotate(45)" : "",
);
const downLineTransform = computed(() =>
  isMobileMenuOpen.value ? "translate(0, 4.25) rotate(-45)" : "",
);
const middleLineOpacity = computed(() => (isMobileMenuOpen.value ? 0 : 1));
const middleLineStyle = computed(() => ({
  transition:
    "opacity 300ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  transform: `scaleY(${middleLineOpacity.value ? 1 : 0})`,
}));
</script>

<template>
  <Button
    class="flex flex-col items-center justify-center rounded gap-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
    variant="link"
    :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
    @click="isMobileMenuOpen = !isMobileMenuOpen"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style="color: currentColor"
    >
      <!-- Up line -->
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        :transform="upLineTransform"
        style="
          transform-origin: left center;
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        "
      />
      <!-- Middle line -->
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        :opacity="middleLineOpacity"
        :style="middleLineStyle"
      />
      <!-- Down line -->
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        :transform="downLineTransform"
        style="
          transform-origin: left center;
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        "
      />
    </svg>
  </Button>
</template>
