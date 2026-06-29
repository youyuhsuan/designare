<script setup lang="ts">
// Primevue
import Divider from "primevue/divider";
// Components
import Header from "@/components/auth/Header.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton.vue";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
</script>

<template>
  <section>
    <!-- Header -->
    <Header />

    <!-- Form -->
    <RegisterForm class="mb-4" />

    <!-- Login Link -->
    <div class="w-full text-sm mb-6">
      <span class="text-stone-600">{{ $t("auth.register.question") }}</span>
      <RouterLink
        :to="ROUTE_CONFIGS.AUTH_LOGIN"
        class="ml-1 text-primary-600 hover:text-primary-800 hover:underline font-medium transition-colors"
        :aria-label="$t('auth.register.ariaLabel')"
      >
        {{ $t("auth.register.action") }}
      </RouterLink>
    </div>

    <Divider align="center" type="solid" class="mb-6">
      <b>{{ $t("common.divider") }}</b>
    </Divider>

    <GoogleOAuthButton class="w-full" />
  </section>
</template>
