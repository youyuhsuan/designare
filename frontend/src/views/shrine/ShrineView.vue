<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// I18n
import { useI18n } from "vue-i18n";
// Components
import ShrineCard from "@/components/common/ShrineCard.vue";
import ShrinesSkeleton from "@/components/shrines/ShrinesSkeleton.vue";
// Composables
import useAsyncPaginatedState from "@/composables/useAsyncPaginatedState";
import useApiShrines from "@/composables/api/useApiShrines";
// Utils
import filterNullish from "@/utils/filterNullish";
// Types
import type { SearchShrinesParams } from "@/types/shrinesType";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { getShrines } = useApiShrines();

const hasSearchQuery = computed(
  () => !!(route.query.shrine || route.query.latitude || route.query.longitude),
);

const shrineState = useAsyncPaginatedState(
  async (page?: number) => await getShrines(filterNullish(buildParams(page))),
);

const buildParams = (page: number = 1): SearchShrinesParams => ({
  page,
  pageSize: 6,
  shrine: (route.query.shrine as string) || undefined,
  latitude: route.query.latitude ? Number(route.query.latitude) : undefined,
  longitude: route.query.longitude ? Number(route.query.longitude) : undefined,
});

const sentinelRef = ref<HTMLElement | null>(null);

const loadMore = async () => {
  if (!shrineState.pagination.value?.hasNextPage) return;

  await shrineState.executeMore(
    (shrineState.pagination.value.currentPage ?? 1) + 1,
  );
};

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) loadMore();
  },
  { threshold: 0.1 },
);

onMounted(async () => {
  await shrineState.execute();
  if (sentinelRef.value) observer.observe(sentinelRef.value);
});

onUnmounted(() => observer.disconnect());
</script>

<template>
  <main
    class="w-full px-6 md:px-16 lg:px-32 pt-10 pb-24"
    :aria-label="t('shrines.ariaLabel.page')"
  >
    <!-- Header -->
    <h1
      class="text-stone-500 dark:text-stone-500 text-4xl md:text-3xl font-light tracking-wider mb-12"
    >
      {{
        route.query.shrine
          ? t("shrines.search.resultsFor", { query: route.query.shrine })
          : t("shrines.heading")
      }}
    </h1>

    <!-- Loading -->
    <ShrinesSkeleton v-if="shrineState.isLoading.value"> </ShrinesSkeleton>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
    >
      <!-- Empty state -->
      <div
        v-if="!shrineState.data.value?.length"
        class="col-span-full flex flex-col items-center justify-center py-32 text-stone-400 dark:text-stone-400 gap-4"
      >
        <i class="pi pi-inbox !text-6xl" />
        <p class="tracking-wider text-sm">
          {{
            hasSearchQuery ? t("shrines.search.noResults") : t("common.empty")
          }}
        </p>
      </div>

      <!-- Shrine cards -->
      <article
        v-else
        v-for="(shrine, index) in shrineState.data.value ?? []"
        :key="shrine.id"
        class="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-4"
        tabindex="0"
        :aria-label="t('shrines.ariaLabel.shrineCard', { name: shrine.name })"
        @click="router.push(`${ROUTE_CONFIGS.SHRINES}/${shrine.id}`)"
        @keydown.enter="router.push(`${ROUTE_CONFIGS.SHRINES}/${shrine.id}`)"
        v-cursor-hover
      >
        <ShrineCard :shrine="shrine" :index="index" />
      </article>
    </div>

    <!-- Observer  -->
    <div ref="sentinelRef" class="h-1" aria-hidden="true" />
  </main>
</template>
