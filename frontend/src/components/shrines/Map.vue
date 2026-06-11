<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
// Stores
import useSettingStore from "@/stores/setting.store";

const props = defineProps<{ longitude: number; latitude: number }>();
const settingStore = useSettingStore();

const vMapEl = ref<HTMLElement | null>(null);

let map: L.Map | null = null;
let L: Awaited<typeof import("leaflet")> | null = null;

const initMapBase = () => {
  if (!vMapEl.value) return;

  map = L.map(vMapEl.value, { scrollWheelZoom: false });
  L.tileLayer(
    `https://tile.jawg.io/jawg-${settingStore.activeTheme ? "light" : "dark"}/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWG_ACCESS_TOKEN}`,
    {
      attribution:
        '© <a href="https://www.jawg.io/">Jawg</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  ).addTo(map);
};

const addShrineMarker = () => {
  if (!map || !props.longitude || !props.latitude) return;

  map.setView([props.latitude, props.longitude], 15);

  L.marker([props.latitude, props.longitude], {
    icon: L.divIcon({
      html: `<svg viewBox="0 0 809.91 522.36" width="44" height="44" style="fill: var(--p-primary-500);"><path d="M664.67,19.23c-55.77,4.63-98.95,5.07-139,5.47-48.51.49-89.52.81-120.71.81s-72.19-.32-120.71-.81c-40.05-.4-83.23-.84-139-5.47C107.25,16.07,57.76,10.5,0,0l6.69,28.98c6.6,2.02,13.94,3.89,21.98,5.38,4.77.88,9.34,1.55,13.69,2.05,2.97,2.97,3.56,26.35,3.56,26.35,73.3,6.2,121.27,8.58,121.27,8.58l-8.16,387.07c-3.98.9-7.97,1.81-11.95,2.71-.74,16.05-1.47,35.41-2.21,51.46-1.92.58-4.84,1.7-7.84,3.98-2.68,2.03-4.44,4.23-5.51,5.81h90.65c-.3-1.08-.9-2.73-2.19-4.38-2.12-2.71-4.81-3.79-5.99-4.18.17-16.14.34-33.86.51-50-2.64-1.35-5.27-2.7-7.91-4.05l8.15-297.77h380.43l8.15,297.77c-2.64,1.35-5.27,2.7-7.91,4.05.17,16.14.34,33.86.51,50-1.18.39-3.87,1.47-5.99,4.18-1.29,1.65-1.89,3.29-2.19,4.38h90.65c-1.07-1.58-2.83-3.78-5.51-5.81-3-2.28-5.92-3.4-7.84-3.98-.74-16.05-1.47-35.41-2.21-51.46-3.98-.9-7.97-1.81-11.95-2.71l-8.16-387.07s47.97-2.37,121.27-8.58c0,0,.59-23.37,3.56-26.35,4.35-.5,8.92-1.17,13.69-2.05,8.03-1.49,15.38-3.36,21.98-5.38l6.69-28.98c-57.76,10.5-107.25,16.07-145.24,19.23ZM383.41,124.09h-165.7v-50.53h165.7v50.53ZM592.2,124.09h-165.7v-50.53h165.7v50.53Z"/></svg>`,
      className: "",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    }),
  }).addTo(map);

  map.attributionControl.addAttribution(
    `<a href="https://www.google.com/maps?q=${props.latitude},${props.longitude}" target="_blank">Google Maps</a>`,
  );
};

onMounted(async () => {
  L = await import("leaflet");
  await import("leaflet/dist/leaflet.css");

  await nextTick();
  initMapBase();
  addShrineMarker();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div ref="vMapEl" class="w-full h-full"></div>
</template>

<style>
.leaflet-control-attribution,
.leaflet-control-attribution a {
  color: var(--p-stone-600) !important;
}
</style>
