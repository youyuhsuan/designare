<script setup lang="ts">
import IconGithubMark from "@/assets/icons/github.svg?component";
import IconLinkIn from "@/assets/icons/linkedin.svg?component";
</script>

<template>
  <footer
    class="h-32 bg-stone-700/60 dark:bg-stone-700/60 border-t border-stone-300 dark:border-stone-300 p-2"
  >
    <div
      class="w-full h-full border-2 border-stone-200 dark:border-stone-200 text-stone-100 dark:text-stone-100 transition-colors duration-300 px-6 md:px-16 lg:px-32 flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <!-- Copyright -->
      <p class="tracking-wider">
        &copy;2026 YOU YU-HSUAN
        <span class="mx-1.5">&middot;</span>
        All rights reserved.
      </p>

      <!-- Social links -->
      <div class="flex items-center gap-5 order-1 sm:order-2">
        <a
          href="https://github.com/youyuhsuan"
          class="group flex items-center gap-1.5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <IconGithubMark class="w-4 h-4" aria-hidden="true" />
          <span class="text-xs tracking-wide">Github</span>
        </a>

        <a
          href="https://www.linkedin.com/in/youyuhsuan/"
          class="group flex items-center gap-1.5"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <IconLinkIn class="w-4 h-4" aria-hidden="true" />
          <span class="text-xs tracking-wide">LinkedIn</span>
        </a>
      </div>
    </div>
  </footer>
</template>
