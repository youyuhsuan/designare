import { createApp } from "vue";
// Prime
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
// i18n
import i18n from "@/config/i18nConfig";
// Pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// Components
import App from "@/App.vue";
import router from "@/router";
// Styles
import "@/assets/main.css";
// Directives
import vCursorHover from "@/directives/cursor";
import vCursorStamp from "@/directives/stamp";

const app = createApp(App);
const pinia = createPinia();

// Customize existing preset
const MyPreset = definePreset(Aura, {
  // Editorial language: zero rounding everywhere (omikuji print style)
  primitive: {
    borderRadius: {
      none: "0",
      xs: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
    },
  },
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: "#FFF0EE",
          100: "#FFD6D0",
          200: "#FFB3A9",
          300: "#FF8F80",
          400: "#FF7057",
          500: "#FF5841",
          600: "#E04030",
          700: "#C02820",
          800: "#8F1810",
          900: "#5C0808",
          950: "#3A0404",
        },
        stone: {
          50: "#FAF8F6",
          100: "#F3EFEB",
          200: "#E8E2DB",
          300: "#D4CBC1",
          400: "#B0A596",
          500: "#8A7E6F",
          600: "#6B6053",
          700: "#4A4239",
          800: "#302A24",
          900: "#1A1612",
        },
        // Aura defaults surface to slate (cool gray) — remap to warm stone
        surface: {
          0: "#FFFFFF",
          50: "#FAF8F6",
          100: "#F3EFEB",
          200: "#E8E2DB",
          300: "#D4CBC1",
          400: "#B0A596",
          500: "#8A7E6F",
          600: "#6B6053",
          700: "#4A4239",
          800: "#302A24",
          900: "#1A1612",
          950: "#0F0D0B",
        },
      },
      dark: {
        primary: {
          "50": "#2A0C0A",
          "100": "#3D1210",
          "200": "#5C1E1A",
          "300": "#8C2E26",
          "400": "#C04438",
          "500": "#E8533F",
          "600": "#FF6E58",
          "700": "#FF8C7A",
          "800": "#FFAD9E",
          "900": "#FFCFC8",
          "950": "#FFE8E4",
        },
        stone: {
          "50": "#0F0D0B",
          "100": "#1A1612",
          "200": "#252019",
          "300": "#36302A",
          "400": "#5A5248",
          "500": "#7A7269",
          "600": "#A09589",
          "700": "#C4BAB0",
          "800": "#E0DAD4",
          "900": "#F5F2EF",
        },
        // Dark-mode surface keeps the standard 50→950 light-to-dark direction
        // (Aura reads surface.900 as content background in dark mode)
        surface: {
          0: "#FFFFFF",
          50: "#FAF8F6",
          100: "#F3EFEB",
          200: "#E8E2DB",
          300: "#D4CBC1",
          400: "#B0A596",
          500: "#8A7E6F",
          600: "#6B6053",
          700: "#4A4239",
          800: "#302A24",
          900: "#1A1612",
          950: "#0F0D0B",
        },
      },
    },
  },
  components: {
    // Flat content surfaces; overlays (Dialog/Toast) keep their shadow for depth separation
    card: {
      root: {
        shadow: "none",
      },
    },
  },
});

app.use(i18n);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);

app.directive("cursor-hover", vCursorHover);
app.directive("cursor-stamp", vCursorStamp);
app.mount("#app");
