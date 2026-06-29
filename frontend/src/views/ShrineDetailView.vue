<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
// I18n
import { useI18n } from "vue-i18n";
// Composables
import useApiShrines from "@/composables/api/useApiShrines";
import useAsyncState from "@/composables/useAsyncState";
// Components
import Image from "@/components/common/Image.vue";
import Map from "@/components/shrines/Map.vue";
import ShrineDetailSkeleton from "@/components/shrines/ShrineDetailSkeleton.vue";
// Utils
import { formatAddress } from "@/utils/formatUI";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
// Store
import useSettingStore from "@/stores/setting.store";

const { t } = useI18n();
const route = useRoute();
const settingStore = useSettingStore();
const { getShrine } = useApiShrines();

const shrineState = useAsyncState(() =>
  getShrine(route.params.id as string).then((r) => r.data),
);

const localeTrackingClass = {
  backToExplore: {
    zh: "tracking-[0.2em]",
    en: "tracking-wide",
  },
  category: { zh: "tracking-[0.2em]", en: "tracking-wide" },
  pilgrimageCircuit: {
    zh: "tracking-[0.25em]",
    en: "tracking-widest",
  },
  label: {
    zh: "tracking-[0.3em]",
    en: "tracking-wider",
  },
};

onMounted(async () => {
  await shrineState.execute();
});
</script>

<template>
  <main class="w-full" :aria-label="t('shrines.detail.ariaLabel.page')">
    <!-- Loading -->
    <ShrineDetailSkeleton v-if="shrineState.isLoading.value">
    </ShrineDetailSkeleton>

    <template
      v-else-if="!shrineState.isLoading.value && shrineState.data.value"
    >
      <!-- Benefits bar -->
      <section
        class="border-b-2 border-stone-500 dark:border-stone-500 flex justify-between px-6 md:px-16 lg:px-32"
      >
        <!-- Back to Shrines -->
        <router-link
          class="flex items-center hover:text-primary-500 gap-1.5 text-[10px] text-stone-400 dark:text-stone-400 py-2.5"
          :class="
            localeTrackingClass.backToExplore[settingStore.currentLanguage]
          "
          :to="ROUTE_CONFIGS.SHRINES"
          v-cursor-hover
        >
          <i class="pi pi-arrow-left text-xs" />
          {{ t("shrines.detail.backToExplore") }}
        </router-link>

        <!-- Category -->
        <div
          v-if="shrineState.data.value.benefits?.length"
          class="grid border-l border-stone-500 dark:border-stone-500"
          :style="{
            gridTemplateColumns: `repeat(${shrineState.data.value.benefits.length}, 1fr)`,
          }"
        >
          <template
            v-for="benefit in shrineState.data.value.benefits"
            :key="benefit"
          >
            <div class="border-r border-stone-500 dark:border-stone-500">
              <div class="w-full h-full flex items-center justify-center">
                <span
                  class="text-[10px] text-stone-600 dark:text-stone-600 text-center py-2.5 px-2.5"
                  :class="
                    localeTrackingClass.category[settingStore.currentLanguage]
                  "
                >
                  {{ benefit }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- Map + Content section -->
      <section
        class="flex h-[85vh] border-b-2 border-stone-500 dark:border-stone-500 mb-12 bg-stone-100 dark:bg-stone-100"
      >
        <!-- Map -->
        <Map
          class="flex-[2]"
          :longitude="shrineState.data.value.longitude"
          :latitude="shrineState.data.value.latitude"
        />

        <!-- Content -->
        <div
          class="flex flex-col flex-[3] border-l-2 border-stone-500 dark:border-stone-500"
        >
          <!--  Header  -->
          <div
            class="w-full border-b-2 border-stone-500 dark:border-stone-500 p-2"
          >
            <div
              class="relative border border-stone-500 dark:border-stone-500 py-6 flex flex-col gap-y-3 items-center justify-center overflow-hidden"
            >
              <h1
                class="text-xl md:text-2xl lg:text-5xl font-bold tracking-wider text-primary-500 dark:text-primary-500"
              >
                {{ shrineState.data.value.name }}
              </h1>
              <p
                class="text-sm text-stone-600 dark:text-stone-600 tracking-wider uppercase"
              >
                {{ formatAddress(shrineState.data.value) }}
              </p>
            </div>
          </div>

          <!-- Image -->
          <Image
            :imageWrapperClass="'w-full h-full p-6 bg-stone-300 dark:bg-stone-300'"
            :imageClass="'w-full h-full object-cover object-center'"
            :imageUrl="shrineState.data.value.imageUrl"
            :name="shrineState.data.value.name"
          />
        </div>
      </section>

      <!-- Info section -->
      <section class="px-6 md:px-16 lg:px-32 mb-16">
        <div class="flex items-center justify-between mb-8">
          <!-- Pilgrimage circuit tag -->
          <span
            class="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-100 px-3 py-1 text-stone-500 dark:text-stone-500"
            :class="
              localeTrackingClass.pilgrimageCircuit[
                settingStore.currentLanguage
              ]
            "
          >
            {{ t("shrines.detail.pilgrimageCircuit") }}
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 flex flex-col gap-10">
            <!-- Description -->
            <div class="w-full">
              <p
                class="text-stone-700 dark:text-stone-700 leading-[2] tracking-wide"
              >
                {{ shrineState.data.value.description ?? "—" }}
              </p>
            </div>

            <!-- Goshrines Description -->
            <div class="w-full flex flex-col gap-3">
              <h2
                class="text-[10px] text-stone-600 dark:text-stone-600"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.goshrine") }}
              </h2>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-1.5">
                <div>
                  <!-- <Image
                    :imageWrapperClass="'w-full p-2 bg-stone-400 dark:bg-stone-400'"
                    :imageClass="'object-contain'"
                    :imageUrl="goshrine"
                    :name="shrineState.data.value.name"
                  ></Image> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div
            class="flex flex-col gap-7 border-stone-200 dark:border-stone-200 border-l pl-12"
          >
            <!-- OpeningHours -->
            <div v-if="shrineState.data.value.openingHours">
              <p
                class="text-[10px] text-stone-700 dark:text-stone-700 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.openingHours") }}
              </p>
              <p class="text-stone-700 dark:text-stone-700 tracking-wide">
                {{ shrineState.data.value.openingHours }}
              </p>
            </div>

            <!-- Access -->
            <div v-if="shrineState.data.value.access">
              <p
                class="text-[10px] text-stone-500 dark:text-stone-500 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.access") }}
              </p>
              <p
                class="text-stone-700 dark:text-stone-700 tracking-wide leading-relaxed"
              >
                {{ shrineState.data.value.access }}
              </p>
            </div>

            <!-- Founded -->
            <div v-if="shrineState.data.value.founded">
              <p
                class="text-[10px] text-stone-500 dark:text-stone-500 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.founded") }}
              </p>
              <p class="text-stone-700 dark:text-stone-700 tracking-wide">
                {{ shrineState.data.value.founded }}
              </p>
            </div>

            <!-- EnshrineDeity -->
            <div v-if="shrineState.data.value.enshrineDeity?.length">
              <p
                class="text-[10px] text-stone-500 dark:text-stone-500 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.enshrineDeity") }}
              </p>
              <ul class="flex flex-col gap-1">
                <li
                  v-for="deity in shrineState.data.value.enshrineDeity"
                  :key="deity"
                  class="text-stone-700 dark:text-stone-700 tracking-wide leading-relaxed"
                >
                  {{ deity }}
                </li>
              </ul>
            </div>

            <!-- Address -->
            <div v-if="shrineState.data.value.address">
              <p
                class="text-[10px] text-stone-500 dark:text-stone-500 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.address") }}
              </p>
              <p
                class="text-stone-700 dark:text-stone-700 tracking-wide leading-relaxed"
              >
                {{ shrineState.data.value.address }}
              </p>
            </div>

            <!-- Website -->
            <div v-if="shrineState.data.value.website">
              <p
                class="text-[10px] text-stone-700 dark:text-stone-700 mb-2"
                :class="localeTrackingClass.label[settingStore.currentLanguage]"
              >
                {{ t("shrines.detail.website") }}
              </p>
              <a
                :href="shrineState.data.value.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-500 hover:opacity-70 transition text-xs tracking-wide underline underline-offset-4 break-all"
              >
                {{ shrineState.data.value.website }}
              </a>
            </div>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
