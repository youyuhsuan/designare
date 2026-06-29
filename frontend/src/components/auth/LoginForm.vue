<script setup lang="ts">
import { ref } from "vue";
// Route
import { useRouter } from "vue-router";
// Primevue
import FloatLabel from "primevue/floatlabel";
import Checkbox from "primevue/checkbox";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
// Zod
import { z } from "zod";
// i18n
import { useI18n } from "vue-i18n";
// Composables
import useAsyncAction from "@/composables/useAsyncAction";
// Schemas
import { emailSchema } from "@/schemas/authSchemas";
// Utils
import generateFieldIds, { type FieldIds } from "@/utils/generateFieldIds";
import type { LoginRequest } from "@/types/authType";
// Stores
import useAuthStore from "@/stores/auth.store";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";

const { t } = useI18n();
const checked = ref<boolean>(false);
const fieldIds = ref<FieldIds>(
  generateFieldIds(["email", "password", "checked"]),
);
const initialValues = ref<LoginRequest>({ email: "", password: "" });
const serverError = ref<string>("");

const { login } = useAuthStore();
const router = useRouter();

const { isLoading, execute } = useAsyncAction(
  (values: LoginRequest) => login(values),
  {
    onError: (error) => {
      serverError.value = error as string;
    },
  },
);

const resolver = zodResolver(
  z.object({
    email: emailSchema(t),
    password: z.string(),
  }),
);

const onFormSubmit = async (e: FormSubmitEvent) => {
  e.originalEvent.preventDefault();
  if (!e.valid) return;

  serverError.value = "";
  const ok = await execute(e.values as LoginRequest);
  if (ok) {
    e.reset();
    router.push(ROUTE_CONFIGS.HOME);
  }
};
</script>

<template>
  <Form
    v-slot="$form"
    :initialValues="initialValues"
    :resolver="resolver"
    :validateOnValueUpdate="false"
    :validateOnBlur="true"
    class="w-full flex flex-col gap-6.5"
    @submit="onFormSubmit"
  >
    <!-- Email -->
    <div class="flex flex-col gap-1">
      <FloatLabel>
        <InputText
          :id="fieldIds.email"
          :invalid="$form.email?.invalid && !!$form.email?.value"
          name="email"
          type="text"
          autocomplete="email"
          fluid
        />
        <label :for="fieldIds.email">
          {{ $t("auth.login.field.email") }}
        </label>
      </FloatLabel>
      <Message
        v-if="$form.email?.invalid && $form.email?.value"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.email.error.message }}
      </Message>
    </div>

    <!-- Password -->
    <div class="flex flex-col gap-1">
      <FloatLabel>
        <!--
          :feedback // Disable password strength indicator
          :inputProps // Pass native HTML attributes to input
          toggleMask // Enable show/hide password toggle button
          fluid // Make component width fill parent container
        -->
        <Password
          :id="fieldIds.password"
          :invalid="$form.password?.invalid && !!$form.password?.value"
          name="password"
          autocomplete="password"
          :feedback="false"
          :inputProps="{ autocomplete: 'current-password' }"
          toggleMask
          fluid
        />
        <label :for="fieldIds.password">
          {{ $t("auth.login.field.password") }}
        </label>
      </FloatLabel>
      <Message
        v-if="$form.password?.invalid && !!$form.password?.value"
        severity="error"
        size="small"
        variant="simple"
      >
        <ul class="my-0 px-4 flex flex-col gap-1">
          <li v-for="(error, index) of $form.password.errors" :key="index">
            {{ error.message }}
          </li>
        </ul>
      </Message>
    </div>

    <div class="flex mb-5 text-xs">
      <!-- Remember me -->
      <div class="flex items-center gap-x-1">
        <Checkbox
          v-model="checked"
          :inputId="fieldIds.checked"
          size="small"
          binary
        />
        <label :for="fieldIds.checked" class="text-stone-600">
          {{ $t("auth.login.rememberMe") }}
        </label>
      </div>

      <!-- Forgot Password -->
      <div class="ml-auto">
        <RouterLink
          :to="ROUTE_CONFIGS.AUTH_FORGOT_PASSWORD"
          class="text-primary-600 hover:text-primary-800 hover:underline"
        >
          {{ $t("auth.login.forgotPassword") }}
        </RouterLink>
      </div>
    </div>

    <!-- Server-side error (e.g. wrong credentials) -->
    <Message v-if="serverError" severity="error" size="small" variant="simple">
      {{ serverError }}
    </Message>

    <!-- Submit Button -->
    <Button
      type="submit"
      severity="secondary"
      :label="$t('auth.login.submit')"
      :loading="isLoading"
      :disabled="$form.valid === false || isLoading"
    />
  </Form>
</template>
