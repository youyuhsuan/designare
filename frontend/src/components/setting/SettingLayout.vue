<script lang="ts" setup>
import { computed } from "vue";
// i18n
import { useI18n } from "vue-i18n";
// Types
import type { SettingView } from "@/types/settingType";

const { t } = useI18n();

const view = defineModel<SettingView>("view");
const menuItems = computed(() => [
  {
    label: t("settings.menu.profile"),
    view: "personal",
    command: () => (view.value = "personal"),
  },
  {
    label: t("settings.menu.appearance"),
    view: "appearance",
    command: () => (view.value = "appearance"),
  },
]);
</script>

<template>
  <div class="flex flex-1">
    <!-- Menu -->
    <aside
      class="shrink-0 self-stretch border-r border-stone-300 dark:border-stone-300"
    >
      <ul class="list-none p-0 m-0 w-48">
        <li
          v-for="item in menuItems"
          :key="item.label"
          class="px-4 py-3 cursor-pointer border-l-2 text-sm tracking-wider transition-colors"
          :class="
            view === item.view
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-stone-600 dark:text-stone-600 hover:text-primary-500'
          "
          @click="item.command"
        >
          {{ item.label }}
        </li>
      </ul>
    </aside>

    <!-- Main layout -->
    <main class="flex-1 px-8 py-10">
      <div
        class="flex flex-col gap-y-1.5 pb-6 mb-6 border-b border-stone-300 dark:border-stone-300"
      >
        <h1
          class="text-3xl font-bold tracking-wider text-stone-700 dark:text-stone-700"
        >
          {{ $t("settings.title") }}
        </h1>
        <span class="text-sm tracking-wide text-stone-500 dark:text-stone-500">
          {{ $t("settings.description") }}
        </span>
      </div>
      <slot></slot>
    </main>
  </div>
</template>
