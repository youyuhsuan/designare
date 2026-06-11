<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
    <div v-for="n in 6" :key="n" class="flex flex-col">
      <Skeleton height="17rem" class="mb-4" />
      <Skeleton height="1.25rem" width="40%" class="mb-2" />
      <Skeleton height="0.875rem" width="80%" />
    </div>
  </div>
</template>
