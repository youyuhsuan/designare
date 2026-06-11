<template>
  <!-- Benefits bar -->
  <section
    class="border-b-2 border-stone-500 dark:border-stone-500 flex justify-between px-6 md:px-16 lg:px-32 py-2.5"
  >
    <!-- Back to Shrines -->
    <Skeleton height="1.25rem" width="7rem" />

    <!-- Category -->
    <div class="flex gap-1">
      <Skeleton height="1.25rem" width="5rem" />
      <Skeleton height="1.25rem" width="5rem" />
      <Skeleton height="1.25rem" width="5rem" />
    </div>
  </section>

  <!-- Map + Content section -->
  <section
    class="flex h-[85vh] border-b-2 border-stone-500 dark:border-stone-500 mb-12"
  >
    <!-- Map -->
    <Skeleton class="flex-[2]" weight="100%" height="100%" borderRadius="0" />

    <!-- Content -->
    <div
      class="flex flex-col flex-[3] border-l-2 border-stone-500 dark:border-stone-500"
    >
      <!--  Header  -->
      <div class="w-full border-b-2 border-stone-500 dark:border-stone-500 p-2">
        <div
          class="border border-stone-500 dark:border-stone-500 py-6 flex flex-col gap-y-3 items-center justify-center"
        >
          <Skeleton height="3rem" width="16rem" />
          <Skeleton height="0.875rem" width="10rem" />
        </div>
      </div>

      <!-- Image -->
      <div class="flex-1 w-full p-6 bg-stone-300 dark:bg-stone-300">
        <Skeleton weight="100%" height="100%" borderRadius="0" />
      </div>
    </div>
  </section>

  <!-- Info section -->
  <section class="px-6 md:px-16 lg:px-32 mb-16">
    <!-- Pilgrimage circuit tag -->
    <Skeleton height="2.4rem" width="12rem" class="mb-10" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 flex flex-col">
        <!-- Description -->
        <div class="flex flex-col gap-4 mb-16">
          <Skeleton height="1.4rem" weight="100%" />
          <Skeleton height="1.4rem" weight="100%" />
          <Skeleton height="1.4rem" weight="100%" />
          <Skeleton height="1.4rem" width="60%" />
        </div>

        <!-- Goshrines Description -->
        <div class="flex flex-col gap-4">
          <Skeleton height="1rem" width="8%" />
          <Skeleton height="26rem" width="36%" borderRadius="0" />
        </div>
      </div>

      <div
        class="flex flex-col gap-4 border-l border-stone-200 dark:border-stone-200 pl-12"
      >
        <Skeleton height="1rem" width="5rem" />
        <Skeleton height="1.4rem" width="80%" class="mb-6" />
        <Skeleton height="1rem" width="5rem" />
        <Skeleton height="1.4rem" width="10%" class="mb-6" />
        <Skeleton height="1rem" width="5rem" />
        <Skeleton height="1.4rem" width="40%" />
        <Skeleton height="1.4rem" width="40%" class="mb-6" />
        <Skeleton height="1rem" width="5rem" />
        <Skeleton height="1.4rem" width="100%" />
      </div>
    </div>
  </section>
</template>
