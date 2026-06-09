<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
// Components
import LoadingView from "@/views/LoadingView.vue";
import Menubar from "@/components/menubar/Menubar.vue";
import Footer from "@/components/Footer.vue";
import CustomCursor from "@/components/CustomCursor.vue";
import StampImpression from "@/components/StampImpression.vue";
// Stores
import useAuthStore from "@/stores/auth.store";
import useSettingStore from "@/stores/setting.store";
import useLoadingStore from "@/stores/loading.store";
// Utils
import debounce from "@/utils/debounce";

// Determine if the current route should be displayed in fullscreen mode
const route = useRoute();
const isFullscreen = computed(() => route.meta.fullscreen === true);

const authStore = useAuthStore();
const settingStore = useSettingStore();
const loadingStore = useLoadingStore();

// A list of DOM events considered indicative of user activity
const ACTIVITY_EVENTS = [
  "mousemove",
  "click",
  "keydown",
  "scroll",
  "touchstart",
] as const;

// Pause the inactivity timer when the user navigates away from the tab, and resume it when the tab becomes visible again
const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    authStore.cancelResetTimer();
  } else {
    authStore.resetTimer();
  }
};

// Debounce the timer reset to avoid firing excessively on high-frequency
const debouncedResetTimer = debounce(authStore.resetTimer, 1000);

// Watch for changes in active theme and update DOM accordingly
watch(
  () => settingStore.activeTheme,
  () => {
    document.documentElement.classList.toggle(
      "app-dark",
      settingStore.shouldBeDark(),
    );
  },
  { immediate: true },
);

// Sync system theme preference changes to DOM when user selects "system" mode
const onSystemThemeChange = (e: MediaQueryListEvent) => {
  if (settingStore.activeTheme === "system") {
    document.documentElement.classList.toggle("app-dark", e.matches);
  }
};

onMounted(() => {
  // Register all activity event listeners and the visibility change handler
  ACTIVITY_EVENTS.forEach((event) =>
    window.addEventListener(event, debouncedResetTimer),
  );
  window.addEventListener("visibilitychange", handleVisibilityChange);

  // Apply the persisted theme and language on initial load
  settingStore.changeThemeMode(settingStore.userTheme);
  settingStore.changeLanguage();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", onSystemThemeChange);
});

// Clean up all event listeners and cancel any pending timer
onBeforeUnmount(() => {
  ACTIVITY_EVENTS.forEach((event) => {
    window.removeEventListener(event, debouncedResetTimer);
  });
  window.removeEventListener("visibilitychange", handleVisibilityChange);
  authStore.cancelResetTimer();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", onSystemThemeChange);
});
</script>

<template>
  <!-- Cursor -->
  <CustomCursor />
  <!-- StampImpression -->
  <StampImpression />

  <!-- Loading -->
  <Transition
    leave-active-class="transition-opacity duration-500 ease-in-out"
    leave-to-class="opacity-0"
  >
    <LoadingView v-if="loadingStore.isGlobalLoading" />
  </Transition>

  <!-- Toast -->
  <Toast />
  <!-- Menubar -->
  <Menubar v-show="!loadingStore.isGlobalLoading" />

  <!-- View -->
  <div :class="isFullscreen ? 'min-h-screen' : 'min-h-screen flex flex-col'">
    <RouterView v-slot="{ Component }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-500 ease-in-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-300 ease-in-out"
        leave-to-class="opacity-0"
      >
        <component
          :is="Component"
          :key="route.matched[0]?.path ?? route.path"
        />
      </Transition>
    </RouterView>
    <!-- Footer -->
    <Footer v-show="!isFullscreen && !loadingStore.isGlobalLoading" />
  </div>
</template>
