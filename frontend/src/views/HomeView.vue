<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
// Router
import { useRouter } from "vue-router";
// Components
import SearchBar from "@/components/common/SearchBar.vue";
import VerticalDate from "@/components/common/VerticalDate.vue";
import ShrineCard from "@/components/common/ShrineCard.vue";
// Composables
import useAsyncState from "@/composables/useAsyncState";
import useApiShrines from "@/composables/api/useApiShrines";
// Types
import type { Shrine } from "@/types/shrinesType";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
// Images
import TwelvePetalFlower from "@/assets/images/twelvePetalFlower.svg?component";

const { t } = useI18n();
const router = useRouter();
const { getFeaturedShrines } = useApiShrines();

const featuredShrines = useAsyncState<Shrine[], []>(
  async () => await getFeaturedShrines().then((r) => r.data),
);

onMounted(async () => {
  await featuredShrines.execute();
});
</script>

<template>
  <main class="w-full bg-stone-50 dark:bg-stone-100" aria-label="homepage">
    <!-- Vertical date — fixed right edge -->
    <VerticalDate />
    <!-- Hero section -->
    <section
      class="w-full h-dvh flex flex-col justify-center gap-3 px-6 md:px-16 lg:px-32 z-10"
      :aria-label="t('home.ariaLabel.heroSection')"
    >
      <!-- Hero content -->
      <h1
        class="title-reveal text-8xl md:text-6xl tracking-0.5 text-primary-500 font-bold"
        v-cursor-hover
      >
        {{ t("common.title") }}
      </h1>
      <p
        class="subtitle-reveal text-sm md:text-base text-stone-400 tracking-wider"
      >
        {{ t("home.hero.subTitle") }}
      </p>

      <!-- Search bar -->
      <SearchBar class="search-reveal w-full" />
    </section>

    <!-- TwelvePetalFlower section -->
    <TwelvePetalFlower
      class="twelve-petal-flower-1 absolute"
      aria-hidden="true"
      v-cursor-stamp
    />
    <TwelvePetalFlower
      class="twelve-petal-flower-2 absolute"
      aria-hidden="true"
      v-cursor-stamp
    />

    <!-- Shrine list section -->
    <section
      class="my-16 md:my-20 px-6 md:px-16 lg:px-32"
      :aria-label="t('home.ariaLabel.featuredtodaySection')"
    >
      <div class="mb-10 flex flex-col gap-2 z-10">
        <span
          class="text-[10px] tracking-[0.25em] uppercase font-medium text-stone-600 dark:text-stone-600"
        >
          {{ t("home.featuredToday.title") }}
        </span>
        <h2
          class="text-2xl md:text-3xl font-bold tracking-wider text-primary-500 dark:text-primary-500"
        >
          {{ t("home.featuredToday.heading") }}
        </h2>
        <p class="text-sm text-stone-500 dark:text-stone-500 tracking-wide">
          {{ t("home.featuredToday.description") }}
        </p>
      </div>

      <!-- Shrine cards loading skeleton-->
      <div
        v-if="featuredShrines.isLoading.value"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        <div v-for="n in 3" :key="n" class="flex flex-col">
          <Skeleton class="mb-4" height="17rem" />
          <Skeleton class="mb-2" height="1.25rem" width="60%" />
          <Skeleton height="0.875rem" width="40%" />
        </div>
      </div>

      <!-- Shrine cards -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      >
        <!-- Empty state -->
        <div
          v-if="!featuredShrines.data.value?.length"
          class="col-span-full flex flex-col items-center justify-center py-24 text-stone-300"
        >
          <i class="pi pi-inbox text-5xl mb-4 opacity-50" />
          <p class="tracking-wider text-sm">{{ t("common.empty") }}</p>
        </div>

        <article
          v-for="(shrine, index) in featuredShrines.data.value ?? []"
          :key="shrine.id"
          class="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-4"
          tabindex="0"
          @click="router.push(`${ROUTE_CONFIGS.SHRINES}/${shrine.id}`)"
          @keydown.enter="router.push(`${ROUTE_CONFIGS.SHRINES}/${shrine.id}`)"
          v-cursor-hover
        >
          <ShrineCard :shrine="shrine" :index="index" />
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.twelve-petal-flower-1 {
  display: block;
  width: 10rem;
  height: 10rem;
  color: var(--p-primary-500);
  top: 25%;
  right: 0%;
  translate: -50% -50%;
  opacity: 0;
  animation:
    stamp-fade-in 1.6s ease-out 0.5s forwards,
    shrine-float 4s ease-in-out 0.5s infinite,
    continuous-rotate-1 20s linear 0.5s infinite;
}

.twelve-petal-flower-2 {
  display: block;
  width: 30rem;
  height: 30rem;
  color: var(--p-primary-500);
  top: 45%;
  right: 0%;
  translate: -50% -50%;
  opacity: 0;
  animation:
    stamp-fade-in 2s ease-out 0.9s forwards,
    shrine-float 5s ease-in-out 0.9s infinite,
    continuous-rotate-2 20s linear 0.9s infinite;
}

@keyframes stamp-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes continuous-rotate-1 {
  from {
    transform: rotate(-90deg);
  }
  to {
    transform: rotate(270deg);
  }
}

@keyframes continuous-rotate-2 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shrine-float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.title-reveal {
  animation: brush-reveal 0.9s ease-out 1.1s both;
}

.divider-reveal {
  animation: brush-reveal 0.7s ease-out 1.28s both;
}

.subtitle-reveal {
  animation: brush-reveal 0.7s ease-out 1.42s both;
}

.search-reveal {
  animation: brush-reveal 0.8s ease-out 1.58s both;
}

@keyframes brush-reveal {
  0% {
    opacity: 0;
    transform: translateY(13px);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
</style>
