import { createRouter, createWebHistory } from "vue-router";
// Components
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/auth/AuthView.vue";
import AboutView from "@/views/AboutView.vue";
// Stores
import useAuthStore from "@/stores/auth.store";
import useLoadingStore from "@/stores/loading.store";
// Configs
import ROUTE_CONFIGS from "@/config/routeConfig";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTE_CONFIGS.HOME,
      name: "home",
      component: HomeView,
    },
    {
      path: ROUTE_CONFIGS.ABOUT,
      name: "about",
      component: AboutView,
    },
    {
      path: ROUTE_CONFIGS.AUTH,
      component: AuthView,
      redirect: ROUTE_CONFIGS.AUTH_LOGIN,
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/views/auth/AuthLoginView.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("@/views/auth/AuthRegisterView.vue"),
        },
        {
          path: "forgot-password",
          name: "forgotPassword",
          component: () => import("@/views/auth/ForgotPasswordView.vue"),
        },
        {
          path: "reset-password",
          name: "resetPassword",
          component: () => import("@/views/auth/ResetPasswordView.vue"),
        },
      ],
    },
    {
      path: ROUTE_CONFIGS.OAUTH,
      name: "oAuthCallback",
      component: { template: "<div></div>" },
      meta: {
        fullscreen: true,
      },
      beforeEnter: async (to) => {
        const authStore = useAuthStore();

        const loadingStore = useLoadingStore();
        loadingStore.start();

        const code = to.query.code as string;
        const state = to.query.state as string;
        const errorParam = to.query.error as string;

        try {
          if (errorParam) throw new Error(`OAuth Error: ${errorParam}`);
          if (!code || !state) throw new Error("Missing code or state");
          if (state !== sessionStorage.getItem("oauth_state"))
            throw new Error("Invalid state parameter");

          sessionStorage.removeItem("oauth_state");
          await authStore.oauth.processGoogleCallback(code);

          return { path: ROUTE_CONFIGS.HOME };
        } catch (error) {
          console.error(error);
          return { path: ROUTE_CONFIGS.HOME, hash: "#error=oauth_failed" };
        } finally {
          loadingStore.stop();
        }
      },
    },
    {
      path: ROUTE_CONFIGS.SETTING,
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ROUTE_CONFIGS.SHRINES,
      name: "shrines",
      component: () => import("@/views/shrine/ShrineView.vue"),
    },
    {
      path: `${ROUTE_CONFIGS.SHRINES}/:id`,
      name: "shrineDetail",
      component: () => import("@/views/ShrineDetailView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  // Restore authentication state if tokens exist, but user is not yet authentocated
  if (
    authStore.accessToken &&
    authStore.refreshToken &&
    !authStore.isAuthenticated
  )
    await authStore.initialize();

  // Redirect to auth page if route requires authentication, but user is not logged in
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: "/auth" };
  }

  // Redirect to home if user is already authenticated and tries to access auth pages
  // Allow reset-password even when authenticated (email link may be clicked while logged in)
  if (
    to.path.startsWith("/auth") &&
    to.name !== "resetPassword" &&
    authStore.isAuthenticated
  ) {
    return { path: "/" };
  }

  // Play intro animation once on first entry to Home or About
  if (to.meta.showLoading) {
    await loadingStore.playIntro();
  }
});

export default router;
