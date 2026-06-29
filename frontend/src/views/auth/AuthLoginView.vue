<script setup lang="ts">
// Primevue
import Divider from "primevue/divider";
// Components
import Header from "@/components/auth/Header.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton.vue";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
</script>

<template>
  <section>
    <!-- Header -->
    <Header />

    <!-- Form -->
    <LoginForm class="mb-4" />

    <!-- Register Link -->
    <div class="w-full text-sm mb-6">
      <span class="text-stone-600">{{ $t("auth.login.question") }}</span>
      <RouterLink
        :to="ROUTE_CONFIGS.AUTH_REGISTER"
        class="ml-1 text-primary-600 hover:text-primary-800 hover:underline font-medium transition-colors"
        :aria-label="$t('auth.login.ariaLabel')"
      >
        {{ $t("auth.login.action") }}
      </RouterLink>
    </div>

    <Divider align="center" type="solid" class="mb-6">
      <b>{{ $t("common.divider") }}</b>
    </Divider>

    <GoogleOAuthButton class="w-full" />
  </section>
</template>
