<script lang="ts" setup>
import { ref } from "vue";
// Types
import type { Shrine } from "@/types/shrinesType";
// Components
import Image from "@/components/common/Image.vue";
// Utils
import { formatAddress } from "@/utils/formatUI";
// Stores
import useAuthStore from "@/stores/auth.store";

const authStore = useAuthStore();

defineProps<{ shrine: Shrine; index: number }>();

const isWishlisted = ref(false);
const isVisited = ref(false);

const toggleWishlist = (e: MouseEvent) => {
  e.stopPropagation();
  isWishlisted.value = !isWishlisted.value;
};

const toggleVisited = (e: MouseEvent) => {
  e.stopPropagation();
  isVisited.value = !isVisited.value;
};
</script>

<template>
  <div class="flex flex-col group">
    <div
      class="relative h-64 mb-4 border-stone-200 dark:border-stone-200 border-2 hover:border-primary-500 hover:shadow-[0_0_0_4px_primary-500] transition-[border-color,box-shadow] duration-300 ease-in-out"
    >
      <Image
        :loading="index <= 6 ? 'eager' : 'lazy'"
        :imageUrl="shrine.imageUrl"
        :name="shrine.name"
        :imageClass="'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'"
      />
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <!-- Hover action row -->
      <div
        v-if="authStore.isAuthenticated"
        class="absolute bottom-0 left-0 right-0 p-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="flex gap-2">
          <!-- Wishlist -->
          <button
            class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            @click="toggleWishlist"
            v-cursor-hover
          >
            <i
              class="text-sm"
              :class="
                isWishlisted ? 'pi pi-heart-fill text-red-400' : 'pi pi-heart'
              "
            />
          </button>

          <!-- Visited -->
          <button
            class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            @click="toggleVisited"
            v-cursor-hover
          >
            <i
              class="text-sm"
              :class="
                isVisited
                  ? 'pi pi-check-circle text-primary-300'
                  : 'pi pi-circle'
              "
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col px-1 gap-1">
      <p
        class="font-medium text-stone-600 dark:text-stone-600 tracking-wide transition-colors group-hover:text-primary-500"
      >
        {{ shrine.name }}
      </p>
      <p class="text-[10px] text-stone-400 dark:text-stone-400">
        {{ formatAddress(shrine) }}
      </p>
    </div>
  </div>
</template>
