<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

defineProps<{ item: MenuItem }>();
</script>

<template>
  <router-link
    v-if="item.route"
    :to="item.route"
    custom
    v-slot="{ navigate, href, isActive }"
  >
    <a
      :href="href"
      :class="[
        'w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300  hover:opacity-80 dark:hover:text-slate-800 transition-colors',
        isActive && 'text-primary',
      ]"
      :aria-label="String(item.label)"
      @click="navigate"
    >
      <i v-if="item.icon" :class="item.icon" />
      <span>{{ item.label }}</span>
    </a>
  </router-link>

  <button
    v-else-if="item.command"
    :class="[
      'w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300  hover:opacity-80 dark:hover:text-slate-800 transition-colors',
    ]"
    :aria-label="String(item.label)"
    @click="(e) => item?.command?.({ originalEvent: e, item })"
  >
    <i v-if="item.icon" :class="item.icon" />
    <span>{{ item.label }}</span>
  </button>
</template>
