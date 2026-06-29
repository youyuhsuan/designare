<script setup lang="ts">
import { computed, ref } from "vue";
// Route
import router from "@/router";
// i18n
import { useI18n } from "vue-i18n";
// Primevue
import Popover from "primevue/popover";
import type { MenuItem as PrimeMenuItem } from "primevue/menuitem";
// Components
import Avatar from "@/components/Avatar.vue";
import ThemeToggle from "@/components/menubar/ThemeToggle.vue";
import MenuItem from "@/components/menubar/MenuItem.vue";
// Stores
import useAuthStore from "@/stores/auth.store";
// Configs
import ROUTE_CONFIGS from "@/config/routeConfig";

const authStore = useAuthStore();

const { t } = useI18n();

const vAuthPopover = ref<InstanceType<typeof Popover> | null>(null);

// User action menu items, isplayed in user profile popover (desktop) and mobile menu
const baseMenuItems = computed<PrimeMenuItem[]>(() => [
  {
    label: t("nav.search"),
    route: ROUTE_CONFIGS.SHRINES,
    command: () => router.push(ROUTE_CONFIGS.SHRINES),
    visible: true,
  },
  {
    label: t("nav.about"),
    route: ROUTE_CONFIGS.ABOUT,
    command: () => router.push(ROUTE_CONFIGS.ABOUT),
    visible: true,
  },
]);
const userMenuItems = computed<PrimeMenuItem[]>(() => [
  {
    label: t("nav.settings"),
    route: ROUTE_CONFIGS.SETTING,
    command: () => router.push(ROUTE_CONFIGS.SETTING),
    visible: authStore.isAuthenticated,
  },
  {
    label: t("nav.signOut"),
    command: async () => {
      vAuthPopover.value?.hide();
      await authStore.logout();
    },
    visible: authStore.isAuthenticated,
  },
]);

const openPopover = (event: MouseEvent) => {
  if (!vAuthPopover.value) return;
  cancelHidePopover();
  vAuthPopover.value.show(event);
};

const togglePopover = (event: MouseEvent) => {
  if (!vAuthPopover.value) return;
  cancelHidePopover();
  vAuthPopover.value.toggle(event);
};

// Hide user profile popover with delay, Uses setTimeout to allow user to move mouse to popover without it closing
let hideTimerId: ReturnType<typeof setTimeout> | null = null;
const hidePopover = () => {
  if (!vAuthPopover.value) return;
  hideTimerId = setTimeout(() => vAuthPopover.value?.hide(), 150);
};

// Cancel pending popover hide operation, Called when user hovers back over the trigger element
const cancelHidePopover = () => {
  if (hideTimerId) clearTimeout(hideTimerId);
  hideTimerId = null;
};
</script>

<template>
  <nav
    class="hidden md:flex items-center gap-4"
    :aria-label="t('nav.ariaLabel.desktop')"
  >
    <!-- Menu Items -->
    <router-link
      v-for="(item, index) in baseMenuItems"
      :key="index"
      :to="item.route"
      class="px-4 text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-stone-600 hover:text-primary-500 transition-colors"
      exact-active-class="!text-primary-500"
      :aria-label="item.label"
      v-cursor-hover
    >
      {{ item.label }}
    </router-link>

    <!-- Theme Toggle -->
    <ThemeToggle v-cursor-hover />

    <!-- Login Button -->
    <template v-if="!authStore.isAuthenticated">
      <router-link
        :to="ROUTE_CONFIGS.AUTH"
        :aria-label="t('nav.ariaLabel.login')"
        class="flex items-center gap-2 px-4 text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-stone-600 hover:text-primary-500 transition-colors"
        v-cursor-hover
      >
        <span>{{ t("nav.login") }}</span>
      </router-link>
    </template>

    <!-- User Avatar -->
    <template v-else>
      <div
        @click="togglePopover"
        @mouseenter="openPopover"
        @mouseleave="hidePopover"
        role="button"
        :aria-label="t('nav.ariaLabel.userMenu')"
        class="cursor-pointer"
      >
        <Avatar />
      </div>

      <!-- User Popover -->
      <Popover
        ref="vAuthPopover"
        @mouseenter="cancelHidePopover"
        @mouseleave="hidePopover"
      >
        <div class="flex flex-col w-[12.5rem] py-1 px-0.5">
          <!-- User Info -->
          <div
            class="flex flex-col items-center cursor-pointer hover:text-primary-500 transition-colors p-2"
            @click="router.push(ROUTE_CONFIGS.SETTING)"
          >
            <Avatar size="xlarge" iconClass="text-4xl" />
            <div class="font-medium text-sm tracking-wider mt-2">
              {{ authStore.user?.name }}
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-stone-300 dark:border-stone-300 my-2" />

          <!-- Action Menu -->
          <ul class="list-none p-0 m-0 flex flex-col">
            <li v-for="(item, index) in userMenuItems" :key="index">
              <MenuItem v-if="item.visible" :item="item" />
            </li>
          </ul>
        </div>
      </Popover>
    </template>
  </nav>
</template>
