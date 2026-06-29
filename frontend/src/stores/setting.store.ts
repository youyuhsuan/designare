import { computed, ref } from "vue";
// Pinia
import { defineStore } from "pinia";
// i18n
import { useI18n } from "vue-i18n";
// Type
import type { theme, Language } from "@/types/settingType";
// Stores
import useAuthStore from "@/stores/auth.store";

const useSettingStore = defineStore(
  "setting",
  () => {
    const authStore = useAuthStore();
    const cursor = ref<{
      type: string;
      size?: number;
      color?: string;
      clickId: number;
    }>({
      type: "dot",
      size: 1,
      color: "var(--p-primary-500)",
      clickId: 0,
    });
    // Theme
    // LocalStorage user theme
    const userTheme = ref<theme>("system");

    // Computed active theme based on authentication state
    const activeTheme = computed(() => {
      if (authStore.isAuthenticated) {
        return userTheme.value;
      } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ===
          true
          ? "dark"
          : "light";
      }
    });

    // Determine if the theme should be dark based on activeTheme
    const shouldBeDark = (): boolean => {
      switch (activeTheme.value) {
        case "light":
          return false;
        case "dark":
          return true;
        default:
          return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    };

    // Update user theme preference and sync DOM
    const changeThemeMode = (mode: theme) => {
      if (authStore.isAuthenticated) userTheme.value = mode;
      document.documentElement.classList.toggle("app-dark", shouldBeDark());
    };

    // i18n
    const { locale } = useI18n();
    const currentLanguage = ref<Language>(locale.value as Language);

    const changeLanguage = () => {
      locale.value = currentLanguage.value;
      document.documentElement.lang = currentLanguage.value;
    };

    return {
      cursor,
      activeTheme,
      userTheme,
      shouldBeDark,
      changeThemeMode,
      currentLanguage,
      changeLanguage,
    };
  },
  {
    persist: [
      {
        key: "theme",
        pick: ["userTheme"],
        storage: localStorage,
      },
      {
        key: "locale",
        pick: ["currentLanguage"],
        storage: localStorage,
      },
    ],
  },
);

export default useSettingStore;
