<script setup lang="ts">
// i18n
import { useI18n } from "vue-i18n";
// Components
import DesktopNav from "@/components/menubar/DesktopNav.vue";
import MobileNav from "@/components/menubar/MobileNav.vue";

const { t } = useI18n();
</script>

<template>
  <div
    class="border-b-2 border-stone-500 dark:border-stone-500 bg-stone-50 dark:bg-stone-100 px-6 md:px-16 lg:px-32"
  >
    <header
      :aria-label="t('nav.ariaLabel.main')"
      class="flex items-center justify-between py-2.5"
    >
      <!-- Logo -->
      <router-link
        v-cursor-hover
        to="/"
        class="font-bold tracking-wider text-stone-700 dark:text-stone-700 hover:text-primary-500 transition-colors duration-300"
      >
        {{ t("common.title") }}
      </router-link>

      <!-- Desktop Navigation-->
      <DesktopNav class="hidden md:flex" />
      <!-- Moblie Navigation -->
      <MobileNav class="md:hidden" />
    </header>
  </div>
</template>

<style scoped>
header {
  transition: background-color 0.3s ease;
  animation: shrine-descent 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s both;
}

@keyframes shrine-descent {
  0% {
    opacity: 0;
    transform: translateY(-120px);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
