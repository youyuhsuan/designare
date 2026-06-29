<script setup lang="ts">
import { computed } from "vue";
// i18n
import { useI18n } from "vue-i18n";
// Primevue
import RadioButton from "primevue/radiobutton";
import Select from "primevue/select";
// Store
import useSettingStore from "@/stores/setting.store";
// Type
import type { Language, LanguageOption } from "@/types/settingType";
// Utils
import generateFieldIds, { type FieldIds } from "@/utils/generateFieldIds";
// Constants
import { THEME_CARD_MAP } from "@/constants/style";
import { SUPPORTED_LOCALES } from "@/constants/common";

const settingStore = useSettingStore();

const { t } = useI18n();
// Generate field IDs for accessibility
const fieldIds: FieldIds = generateFieldIds(SUPPORTED_LOCALES);
const languageOption = computed<LanguageOption[]>(() =>
  SUPPORTED_LOCALES.map((code: Language) => ({
    name: t(`settings.appearance.language.options.${code}`),
    code,
  })),
);

// Frame border classes shared by the double-frame card (ShrineCard language)
const frameClass = (active: boolean) =>
  active
    ? "border-primary-500 dark:border-primary-500"
    : "border-stone-500 dark:border-stone-500 hover:border-primary-500 dark:hover:border-primary-500 group-hover:border-primary-500 dark:group-hover:border-primary-500";
</script>

<template>
  <section class="mb-8">
    <!-- Theme Selection -->
    <div class="mb-6">
      <h2
        class="text-[10px] tracking-[0.25em] uppercase font-medium text-stone-600 dark:text-stone-600 mb-1"
      >
        {{ $t("settings.appearance.theme.title") }}
      </h2>
      <p class="text-sm text-stone-500 dark:text-stone-500">
        {{ $t("settings.appearance.theme.description") }}
      </p>
    </div>

    <div class="flex gap-4 flex-col md:flex-row">
      <template v-for="card in THEME_CARD_MAP" :key="card.view">
        <div class="relative w-full">
          <div
            class="group flex flex-col h-full cursor-pointer border-2 p-1.5 transition-colors duration-300"
            :class="frameClass(settingStore.userTheme === card.view)"
            @click="settingStore.changeThemeMode(card.view)"
          >
            <div
              class="flex flex-col flex-1 border transition-colors duration-300"
              :class="frameClass(settingStore.userTheme === card.view)"
            >
              <!-- Preview mat -->
              <div class="h-32 md:h-40 p-2.5 bg-stone-100 dark:bg-stone-100">
                <img
                  v-if="card.src"
                  class="w-full h-full object-cover"
                  :src="card.src"
                  :alt="$t(`settings.appearance.theme.options.${card.view}`)"
                />
              </div>

              <!-- Label -->
              <div
                class="flex items-center justify-center border-t px-3 py-3 transition-colors duration-300"
                :class="frameClass(settingStore.userTheme === card.view)"
              >
                <span
                  class="text-[10px] tracking-[0.2em] uppercase transition-colors"
                  :class="
                    settingStore.userTheme === card.view
                      ? 'text-primary-500 dark:text-primary-500'
                      : 'text-stone-600 dark:text-stone-600 group-hover:text-primary-500'
                  "
                >
                  {{ $t(`settings.appearance.theme.options.${card.view}`) }}
                </span>
              </div>
            </div>
          </div>
          <RadioButton
            class="!absolute !right-2.5 !bottom-2.5"
            v-model="settingStore.userTheme"
            :value="card.view"
          />
        </div>
      </template>
    </div>
  </section>

  <!-- Language Selection -->
  <section>
    <div class="mb-6">
      <h2
        class="text-[10px] tracking-[0.25em] uppercase font-medium text-stone-600 dark:text-stone-600 mb-1"
      >
        {{ $t("settings.appearance.language.title") }}
      </h2>
      <p class="text-sm text-stone-500 dark:text-stone-500">
        {{ $t("settings.appearance.language.description") }}
      </p>
    </div>

    <FloatLabel class="w-full max-w-xs">
      <Select
        v-model="settingStore.currentLanguage"
        :inputId="fieldIds.language"
        :options="languageOption"
        optionLabel="name"
        optionValue="code"
        class="w-full"
        checkmark
        @change="settingStore.changeLanguage()"
        :placeholder="$t('settings.appearance.language.placeholder')"
      />
    </FloatLabel>
  </section>
</template>
