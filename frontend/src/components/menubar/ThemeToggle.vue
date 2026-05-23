<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ToggleSwitch from "primevue/toggleswitch";
// Stores
import useAuthStore from "@/stores/auth.store";
import useSettingStore from "@/stores/setting.store";

const isDark = ref<boolean>(false);

const authStore = useAuthStore();
const settingStore = useSettingStore();

// Toggle between light and dark modes
const toggleThemeMode = () => {
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
  <ToggleSwitch v-model="isDark" @update:modelValue="toggleThemeMode">
    <template #handle="{ checked }">
      <i :class="['!text-xs pi', checked ? 'pi-moon' : 'pi-sun']" />
    </template>
  </ToggleSwitch>
</template>
