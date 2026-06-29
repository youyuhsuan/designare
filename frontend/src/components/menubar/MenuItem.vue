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
        'w-full flex items-center px-4 py-2 text-sm tracking-[0.2em] hover:text-primary-500 transition-colors',
        isActive
          ? 'text-primary-500 dark:text-primary-500'
          : 'text-stone-700 dark:text-stone-700',
      ]"
      :aria-label="String(item.label)"
      @click="navigate"
    >
      <span>{{ item.label }}</span>
    </a>
  </router-link>

  <button
    v-else-if="item.command"
    class="w-full flex items-center px-4 py-2 text-sm tracking-[0.2em] text-stone-700 dark:text-stone-700 hover:text-primary-500 transition-colors"
    :aria-label="String(item.label)"
    @click="(e) => item?.command?.({ originalEvent: e, item })"
  >
    <span>{{ item.label }}</span>
  </button>
</template>
