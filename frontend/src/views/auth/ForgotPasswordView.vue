<script setup lang="ts">
// Components
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.vue";
import Header from "@/components/auth/Header.vue";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
</script>

<template>
  <section>
    <!-- Header -->
    <Header />
    <!-- Form -->
    <ForgotPasswordForm class="mb-4" />

    <!-- Login Link -->
    <div class="w-full text-sm mb-6">
      <span class="text-stone-600">{{ $t("auth.login.question") }}</span>
      <RouterLink
        :to="ROUTE_CONFIGS.AUTH_LOGIN"
        class="ml-1 text-primary-600 hover:text-primary-800 hover:underline font-medium transition-colors"
        :aria-label="$t('auth.login.ariaLabel')"
      >
        {{ $t("auth.login.action") }}
      </RouterLink>
    </div>
  </section>
</template>
