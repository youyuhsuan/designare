<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
// i18n
import { useI18n } from "vue-i18n";
// Primevue
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import FileUpload, { type FileUploadSelectEvent } from "primevue/fileupload";
import Dialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
// Zod
import z from "zod";
// Router
import router from "@/router";
// Components
import Avatar from "@/components/Avatar.vue";
// Composables
import useApiUser from "@/composables/api/useApiUser";
import useMessage from "@/composables/useMessage";
import useApiAuth from "@/composables/api/useApiAuth";
// Stores
import useAuthStore from "@/stores/auth.store";
// Config
import ROUTE_CONFIGS from "@/config/routeConfig";
// Utiles
import compressImage from "@/utils/compressImage";
import generateFieldIds from "@/utils/generateFieldIds";
import type { FieldIds } from "@/utils/generateFieldIds";
// Type
import type { User, UpdateRequest } from "@/types/userType";

const { t } = useI18n();

const { getUser, updateUser, uploadUserImage, deleteUser } = useApiUser();
const { getCurrentAuth } = useApiAuth();

const userInfo = ref<User>({
  name: "",
  email: "",
  picture: "",
  bio: "",
  location: "",
  favoriteGoods: [],
  birthDate: null,
});
const isLoading = ref<boolean>(false);

const authStore = useAuthStore();
const avatarSize = computed(() => {
  const width = window.innerWidth;
  if (width < 1024) return "large"; // mobile, tablet

  return "xlarge"; // desktop
});

// Profile Picture Upload
// Controls profile picture upload dialog visibility
const isVisibleDialog = ref<boolean>(false);

// Reference to PrimeVue FileUpload instance for programmatic control
const vFileUpload = ref<InstanceType<typeof FileUpload> | null>(null);
const selectedFile = ref<File | null>(null);

// Store the first selected file from FileUpload event
const onSelectedFile = (event: FileUploadSelectEvent) => {
  if (event.files.length === 0) return;
  selectedFile.value = event.files[event.files.length - 1];
};

// Compress and upload the selected profile picture
const saveUpload = async () => {
  if (!selectedFile.value || !authStore.user?.id) return;

  isLoading.value = true;
  try {
    // Compress image before upload
    const image = await compressImage(selectedFile.value);
    if (!image) return;

    // Build FormData with compressed file
    const formData = new FormData();
    formData.append("file", image);

    await uploadUserImage(authStore.user?.id, formData);
    authStore.user = (await getCurrentAuth()).data;

    isVisibleDialog.value = false;
  } catch (error: unknown) {
    console.error("Failed to upload profile picture:", error);
    if (typeof error === "string") showWarning(error);
  } finally {
    isLoading.value = false;
  }
};

// Clear FileUpload state and close the dialog
const cancelUpload = () => {
  (vFileUpload.value as any)?.clear();
  selectedFile.value = null;
  isVisibleDialog.value = false;
};

// Toggles between view and edit mode
const isEdit = ref<boolean>(false);
const toggleEditMode = () => {
  isEdit.value = true;
  initialValues.value = userInfo.value;
};
// Edit Mode
const fieldIds: FieldIds = generateFieldIds([
  "name",
  "birthDate",
  "bio",
  "location",
  "favoriteGoods",
]);
const initialValues = ref<User>({
  name: "",
  email: "",
  birthDate: null,
  bio: "",
  location: "",
  favoriteGoods: [],
});

const resolver = zodResolver(
  z.object({
    name: z
      .string()
      .min(1, { message: t("settings.profile.validation.name.min") })
      .max(100, { message: t("settings.profile.validation.name.max") }),
    bio: z
      .string()
      .max(500, { message: t("settings.profile.validation.bio.max") })
      .optional(),
    location: z
      .string()
      .max(100, { message: t("settings.profile.validation.location.max") })
      .optional(),
    birthDate: z.coerce
      .date()
      .max(new Date(), {
        message: t("settings.profile.validation.birthDate.max"),
      })
      .nullable()
      .optional(),
  }),
);
const { showWarning, showInfo } = useMessage();

// Handle profile name update form submission
const onFormSubmit = async (e: FormSubmitEvent) => {
  if (!authStore.user) return;
  // Prevent the browser's default form submission behavior
  e.originalEvent.preventDefault();

  // Check if all form fields have passed valida
  // tion
  if (e.valid) {
    isLoading.value = true;
    try {
      const isChanged = (key: string, value: unknown): boolean => {
        const original = initialValues.value[key as keyof User];
        if (value instanceof Date && original instanceof Date) {
          return value.getTime() !== original.getTime();
        }
        return value !== original;
      };
      const updatedFields: UpdateRequest = Object.fromEntries(
        Object.entries(e.values as User).filter(
          ([key, value]: [string, unknown]) => isChanged(key, value),
        ),
      );

      await updateUser(authStore.user.id, updatedFields);

      if (updatedFields.name) {
        authStore.user.name = updatedFields.name;
      }
      userInfo.value = {
        ...userInfo.value,
        ...updatedFields,
      };

      isEdit.value = false;
      showInfo(t("settings.profile.dialog.message.updateSuccess"));
    } catch (error: unknown) {
      if (typeof error === "string") showWarning(error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Delete Account
const confirm = useConfirm();
const deleteUserAccount = async () => {
  if (!authStore.user) return;

  confirm.require({
    message: t("settings.profile.deleteAccount.message"),
    header: t("settings.profile.deleteAccount.title"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("common.cancel"),
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: t("common.delete"),
      severity: "danger",
    },
    accept: async () => {
      if (!authStore.user) return;

      try {
        await deleteUser(authStore.user!.id);
        // Clear auth state after account deletion
        await authStore.logout();
        router.push(ROUTE_CONFIGS.AUTH);
      } catch (error: unknown) {
        if (typeof error === "string") showWarning(error);
      }
    },
  });
};

onMounted(async () => {
  userInfo.value = (await getUser(authStore.user!.id)).data;
});
</script>

<template>
  <!-- Section header with edit toggle -->
  <div class="flex justify-between mb-6">
    <div>
      <h2
        class="text-[10px] tracking-[0.25em] uppercase font-medium text-stone-600 dark:text-stone-600 mb-1"
      >
        {{ $t("settings.profile.title") }}
      </h2>
      <p class="text-sm text-stone-500 dark:text-stone-500">
        {{ $t("settings.profile.description") }}
      </p>
    </div>
    <Button
      v-if="!isEdit"
      variant="outlined"
      severity="secondary"
      icon="pi pi-pencil"
      size="small"
      :label="$t('common.edit')"
      :aria-label="$t('settings.profile.ariaLabel.edit')"
      @click="toggleEditMode()"
    >
    </Button>
  </div>

  <!-- View mode container -->
  <section v-if="!isEdit">
    <div class="flex items-center gap-4 mb-8">
      <!-- Avatar -->
      <div class="relative w-fit">
        <Avatar
          :size="avatarSize"
          iconClass="text-4xl"
          avatarClass="!w-18 !h-18"
        />
        <!-- Upload image button -->
        <Button
          class="-bottom-1.5 -right-1.5"
          :pt="{
            root: {
              style: 'position: absolute',
            },
          }"
          icon="pi pi-image"
          rounded
          severity="secondary"
          :aria-label="$t('settings.profile.ariaLabel.uploadImage')"
          size="small"
          @click="isVisibleDialog = true"
        />

        <!-- Upload image dialog -->
        <Dialog
          v-model:visible="isVisibleDialog"
          modal
          :header="$t('settings.profile.dialog.title')"
          :style="{ width: '25rem' }"
        >
          <FileUpload
            ref="vFileUpload"
            accept="image/*"
            @select="onSelectedFile"
          >
            <template #header="{ chooseCallback }">
              <Button
                class="w-100"
                icon="pi pi-images"
                variant="outlined"
                severity="secondary"
                :label="$t('settings.profile.uploadImage')"
                :aria-label="$t('settings.profile.ariaLabel.uploadImage')"
                @click="chooseCallback()"
                autofocus
              />
            </template>

            <template #content="{ uploadedFiles, files, messages }">
              <div class="flex justify-center">
                <div v-if="files.length > 0">
                  <div
                    :key="
                      files[files.length - 1].name +
                      files[files.length - 1].type +
                      files[files.length - 1].size
                    "
                    class="flex flex-col items-center gap-2"
                  >
                    <img
                      class="rounded-full object-cover w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
                      role="presentation"
                      :alt="files[files.length - 1].name"
                      :src="(files[files.length - 1] as any).objectURL"
                    />
                    <span
                      class="text-sm text-surface-500 text-ellipsis max-w-40 whitespace-nowrap overflow-hidden"
                    >
                      {{ files[files.length - 1].name }}
                    </span>
                  </div>
                </div>

                <Message
                  v-for="message of messages"
                  :key="message"
                  :class="{ 'mb-8': !files.length && !uploadedFiles.length }"
                  severity="error"
                >
                  {{ message }}
                </Message>
              </div>
            </template>

            <template #empty>
              <div class="flex items-center justify-center">
                <Avatar
                  :size="avatarSize"
                  iconClass="text-4xl"
                  avatarClass="!w-24 !h-24 sm:!w-32 sm:!h-32 lg:!w-40 lg:!h-40"
                />
              </div>
            </template>
          </FileUpload>

          <!-- Modal footer -->
          <template #footer v-if="selectedFile">
            <!-- Cancel Button -->
            <Button
              :label="$t('common.cancel')"
              :aria-label="$t('common.cancel')"
              text
              severity="secondary"
              @click="cancelUpload()"
            />
            <!-- Save Button -->
            <Button
              :label="$t('common.save')"
              :aria-label="$t('common.save')"
              variant="outlined"
              severity="secondary"
              @click="saveUpload"
            />
          </template>
        </Dialog>
      </div>

      <!-- User display name -->
      <div class="flex flex-col">
        <span class="text-2xl font-bold tracking-wide">
          {{ userInfo.name }}
        </span>
        <span class="text-lg">
          {{ userInfo.email }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-4 mb-12">
      <!-- Bio -->
      <div class="flex flex-col gap-1" v-if="userInfo.bio">
        <span
          class="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-400"
        >
          {{ $t("settings.profile.field.bio") }}
        </span>
        <span class="whitespace-pre-line">
          {{ userInfo.bio }}
        </span>
      </div>

      <!-- Location -->
      <div class="flex flex-col gap-1" v-if="userInfo.location">
        <span
          class="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-400"
        >
          {{ $t("settings.profile.field.location") }}
        </span>
        <span class="whitespace-pre-line">
          {{ userInfo.location }}
        </span>
      </div>
      <div class="flex flex-col gap-1" v-if="userInfo.birthDate">
        <span
          class="text-[10px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-400"
        >
          {{ $t("settings.profile.field.birthDate") }}
        </span>
        <span class="whitespace-pre-line">
          {{
            userInfo.birthDate
              ? new Date(userInfo.birthDate).toLocaleDateString()
              : ""
          }}
        </span>
      </div>
    </div>

    <!-- Delete account -->
    <div
      class="flex justify-between items-center border-t border-stone-300 dark:border-stone-300 pt-6"
    >
      <div>
        <h2
          class="text-[10px] tracking-[0.25em] uppercase font-medium text-primary-500 dark:text-primary-400 mb-1"
        >
          {{ $t("settings.profile.deleteAccount.title") }}
        </h2>
        <span class="text-sm text-stone-500 dark:text-stone-500">
          {{ $t("settings.profile.deleteAccount.description") }}
        </span>
      </div>
      <div>
        <Button
          size="small"
          severity="danger"
          :label="$t('settings.profile.deleteAccount.title')"
          :aria-label="$t('settings.profile.ariaLabel.deleteAccount')"
          @click="deleteUserAccount()"
        />
        <ConfirmDialog></ConfirmDialog>
      </div>
    </div>
  </section>

  <!-- Edit mode container -->
  <section v-else>
    <Form
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      :validateOnValueUpdate="false"
      :validateOnBlur="true"
      class="flex flex-col gap-6.5 w-full mb-4"
      @submit="onFormSubmit"
    >
      <div class="flex flex-col gap-4 mb-6">
        <!-- Name -->
        <div class="flex flex-col gap-2">
          <label :for="fieldIds.name" class="text-sm font-medium">
            {{ $t("settings.profile.field.name") }}
          </label>
          <InputText
            :id="fieldIds.name"
            :invalid="$form.name?.invalid"
            :placeholder="$t('settings.profile.placeholder.name')"
            name="name"
            type="text"
            autocomplete="name"
            fluid
          />
          <Message
            v-if="$form.name?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.name.error.message }}
          </Message>
        </div>

        <!-- Bio -->
        <div class="flex flex-col gap-2">
          <label :for="fieldIds.bio" class="text-sm font-medium">
            {{ $t("settings.profile.field.bio") }}
          </label>
          <Textarea
            :id="fieldIds.bio"
            :invalid="$form.bio?.invalid"
            :placeholder="$t('settings.profile.placeholder.bio')"
            name="bio"
            rows="5"
            cols="30"
            autoResize
          />
          <Message
            v-if="$form.bio?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.bio.error.message }}
          </Message>
        </div>

        <!-- Location -->
        <div class="flex flex-col gap-2">
          <label :for="fieldIds.location" class="text-sm font-medium">
            {{ $t("settings.profile.field.location") }}
          </label>
          <InputText
            :id="fieldIds.location"
            :invalid="$form.location?.invalid"
            :placeholder="$t('settings.profile.placeholder.location')"
            name="location"
            type="text"
            fluid
          />
          <Message
            v-if="$form.location?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.location.error.message }}
          </Message>
        </div>

        <!-- BirthDate -->
        <div class="flex flex-col gap-2">
          <label :for="fieldIds.birthDate" class="text-sm font-medium">
            {{ $t("settings.profile.field.birthDate") }}
          </label>
          <DatePicker
            name="birthDate"
            :placeholder="$t('settings.profile.placeholder.birthDate')"
            dateFormat="dd/mm/yy"
            :maxDate="new Date()"
            fluid
            showClear
          />
          <Message
            v-if="$form.birthDate?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.birthDate.error.message }}
          </Message>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <!-- Cancel Button -->
        <Button
          type="button"
          severity="secondary"
          variant="outlined"
          :label="$t('common.cancel')"
          :aria-label="$t('common.cancel')"
          @click="isEdit = false"
        />
        <!-- Save Button -->
        <Button
          type="submit"
          severity="primary"
          :label="$t('settings.profile.submit')"
          :aria-label="$t('settings.profile.ariaLabel.submit')"
          :loading="isLoading"
          :disabled="$form.valid === false"
        />
      </div>
    </Form>
  </section>
</template>
