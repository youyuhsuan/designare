<script setup lang="ts">
import { computed, ref } from "vue";
// Route
import router from "@/router";
// i18n
import { useI18n } from "vue-i18n";
// Primevue
import Divider from "primevue/divider";
import "primeicons/primeicons.css";
import type { MenuItem as PrimeMenuItem } from "primevue/menuitem";
// Components
import Avatar from "@/components/Avatar.vue";
import Hamburger from "@/components/menubar/Hamburger.vue";
import ThemeToggle from "@/components/menubar/ThemeToggle.vue";
import MenuItem from "@/components/menubar/MenuItem.vue";
// Stores
import useAuthStore from "@/stores/auth.store";
// Configs
import ROUTE_CONFIGS from "@/config/routeConfig";

const authStore = useAuthStore();

const { t } = useI18n();

const isMobileMenuOpen = ref<boolean>(false);
const closeMobilePopover = () => (isMobileMenuOpen.value = false);

// User action menu items
const menuItems = computed<PrimeMenuItem[]>(() => [
  {
    label: t("nav.about"),
    icon: "pi pi-info-circle",
    command: () => {
      closeMobilePopover();
      router.push(ROUTE_CONFIGS.ABOUT);
    },
    visible: true,
  },
  {
    label: t("nav.login"),
    icon: "pi pi-sign-in",
    command: () => {
      closeMobilePopover();
      router.push(ROUTE_CONFIGS.AUTH);
    },
    visible: !authStore.isAuthenticated,
  },
  {
    label: t("nav.settings"),
    icon: "pi pi-cog",
    command: () => {
      closeMobilePopover();
      router.push(ROUTE_CONFIGS.SETTING);
    },
    visible: authStore.isAuthenticated,
  },
  {
    label: t("nav.signOut"),
    icon: "pi pi-sign-out",
    command: async () => {
      closeMobilePopover();
      await authStore.logout();
    },
    visible: authStore.isAuthenticated,
  },
]);
</script>

<template>
  <nav class="flex items-center gap-2" :aria-label="t('nav.ariaLabel.mobile')">
    <!-- Theme Toggle -->
    <ThemeToggle />

    <!-- Hamburger Menu -->
    <div class="relative z-[60]">
      <Hamburger
        v-model:isMobileMenuOpen="isMobileMenuOpen"
        :aria-label="t('nav.ariaLabel.toggleMenu')"
      />
    </div>

    <!-- Mobile Popover -->
    <Teleport to="body">
      <!-- Popover Content -->
      <transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 bg-white dark:bg-slate-800 z-50 p-4"
          @click.stop
        >
          <!-- User Info -->
          <template v-if="authStore.isAuthenticated">
            <div
              class="flex flex-col items-center cursor-pointer hover:opacity-80 transition p-2"
              @click="router.push(ROUTE_CONFIGS.SETTING)"
            >
              <Avatar size="xlarge" iconClass="text-4xl" />
              <div class="font-medium text-sm mt-2">
                {{ authStore.user?.name }}
              </div>
            </div>

            <!-- Divider -->
            <Divider class="my-2" />
          </template>

          <!-- Menu Items -->
          <ul class="list-none p-0 m-0 flex flex-col gap-0">
            <li v-for="(item, index) in menuItems" :key="index">
              <MenuItem v-if="item.visible" :item="item" />
            </li>
          </ul>
        </div>
      </transition>
    </Teleport>
  </nav>
</template>
