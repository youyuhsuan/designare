<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
// Router
import { useRouter, type LocationQueryRaw } from "vue-router";
// Primevue
import AutoComplete from "primevue/autocomplete";
// Composables
import useAsyncState from "@/composables/useAsyncState";
import useApiShrines from "@/composables/api/useApiShrines";
import useMessage from "@/composables/useMessage";
// Types
import type { SuggestionShrine } from "@/types/shrinesType";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
// Utils
import filterNullish from "@/utils/filterNullish";
import debounce from "@/utils/debounce";

const { t } = useI18n();
const router = useRouter();
const { getShrineSuggestions } = useApiShrines();
const { showWarning } = useMessage();

const keyword = ref<{ shrine: string; location: string }>({
  shrine: "",
  location: "",
});
const location = ref<{ latitude: number; longitude: number } | null>(null);

const getUserLocation = () => {
  // Check if the browser supports geolocation API
  if (!navigator.geolocation) {
    showWarning(t("home.location.notSupported"));
    return;
  }

  // Request user's current position
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      location.value = { latitude, longitude };
      keyword.value.location = t("home.location.currentLocation");
    },
    (error) => {
      console.error(error);
      showWarning(t("home.location.permissionDenied"));
    },
  );
};

// Store for shrine suggestions fetched from API
const suggest = useAsyncState<SuggestionShrine[], []>(() =>
  getShrineSuggestions(keyword.value.shrine).then((r) => r.data),
);

// Fetch shrine suggestions based on user input
const debouncedExecute = debounce(suggest.execute);
const onSearchShrineSuggestions = () => {
  if (!keyword.value.shrine) return;
  debouncedExecute();
};

const onSelectSuggestion = (event: { value: SuggestionShrine }) => {
  keyword.value.shrine = event.value.name;
};

// Navigate to search results page with query parameters
const navigateToSearch = () => {
  const query = filterNullish({
    shrine: keyword.value.shrine || undefined,
    latitude: location.value?.latitude,
    longitude: location.value?.longitude,
    page: 1,
  });
  router.push({
    path: ROUTE_CONFIGS.SHRINES,
    query: query as LocationQueryRaw,
  });
};
</script>

<template>
  <InputGroup
    class="!w-full !max-w-[560px] !rounded-none !border-2 !border-stone-500 dark:!border-stone-500 !bg-stone-50 dark:!bg-stone-50 !overflow-hidden transition-colors duration-300 hover:!border-primary-500 focus-within:!border-primary-500"
  >
    <!-- Location input -->
    <div class="relative flex items-center flex-1 min-w-0">
      <input
        v-model="keyword.location"
        class="w-full px-5 py-3.5 outline-none text-sm bg-transparent text-stone-700 placeholder:text-stone-300"
        type="text"
        :placeholder="t('home.placeholder.location')"
      />
      <Button
        class="!absolute !right-1 !w-9 !h-9 hover:!bg-primary-50 hover:!text-primary-500 !transition-colors"
        icon="pi pi-map-marker"
        severity="secondary"
        variant="text"
        :aria-label="t('home.ariaLabel.getCurrentLocation')"
        @click="getUserLocation"
      />
    </div>

    <!-- Divider -->
    <div class="py-2.5">
      <div class="h-full border-r border-stone-300 dark:border-stone-300" />
    </div>

    <!-- Shrine autocomplete -->
    <AutoComplete
      v-model="keyword.shrine"
      :pt="{
        pcInputText: {
          root: {
            class:
              '!border-none !shadow-none !text-sm !bg-transparent !px-5 !py-3.5 !text-stone-700 placeholder:!text-stone-300',
          },
        },
      }"
      optionLabel="name"
      :placeholder="t('home.placeholder.shrine')"
      :suggestions="suggest.data.value ?? []"
      @complete="onSearchShrineSuggestions"
      @option-select="onSelectSuggestion"
    />

    <!-- Search button -->
    <Button
      class="!rounded-none !px-6 !bg-primary-500 hover:!bg-primary-600 !border-none !transition-colors"
      :loading="suggest.isLoading.value"
      icon="pi pi-search"
      :aria-label="t('home.ariaLabel.searchShrine')"
      @click="navigateToSearch"
    />
  </InputGroup>
</template>
