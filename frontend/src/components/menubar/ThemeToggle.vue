<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
// i18n
import { useI18n } from "vue-i18n";
// Stores
import useAuthStore from "@/stores/auth.store";
import useSettingStore from "@/stores/setting.store";

const isDark = ref<boolean>(false);

const { t } = useI18n();
const authStore = useAuthStore();
const settingStore = useSettingStore();

// Toggle between light and dark modes
const toggleThemeMode = () => {
  isDark.value = !isDark.value;
  if (authStore.isAuthenticated) {
    void settingStore.changeThemeMode(isDark.value ? "dark" : "light");
  } else {
    document.documentElement.classList.toggle("app-dark", isDark.value);
  }
};

// Watch settingStore.userTheme to update UI theme
watch(
  () => settingStore.activeTheme,
  () => {
    isDark.value = settingStore.activeTheme === "dark";
  },
);

onMounted(() => {
  isDark.value = settingStore.activeTheme === "dark";
});
</script>

<template>
  <!-- Icon shows the mode you switch TO: moon in light mode, sun in dark mode -->
  <button
    type="button"
    class="flex items-center justify-center p-2 text-stone-700 dark:text-stone-700 hover:text-primary-500 transition-colors cursor-pointer"
    :aria-pressed="isDark"
    :aria-label="
      isDark ? t('nav.ariaLabel.switchToLight') : t('nav.ariaLabel.switchToDark')
    "
    @click="toggleThemeMode"
  >
    <!-- Sun -->
    <svg
      v-if="isDark"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
    </svg>

    <!-- Moon -->
    <svg
      v-else
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>
