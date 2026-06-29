<script setup lang="ts">
import ShrineGate from "@/assets/images/loadingShrine.svg?component";
</script>

<template>
  <main>
    <div class="scene-3d bg-stone-50 dark:bg-stone-100">
      <div v-for="i in 8" :key="i" class="gate-layer" :class="`layer-${i}`">
        <ShrineGate />
      </div>
    </div>
    <div class="convergence-overlay" />
  </main>
</template>

<style scoped>
.scene-3d {
  position: fixed;
  inset: 0;
  z-index: 50;
  perspective: 100vmin;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  overflow: hidden;
}

.gate-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140vmin;
  aspect-ratio: 810 / 522;
  will-change: transform;
  animation: gate-traverse 4.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
}

.gate-layer :deep(svg) {
  width: 100%;
  height: 100%;
}

@keyframes gate-traverse {
  0% {
    transform: translate(-50%, -50%) translateZ(-3500px);
  }
  85% {
    transform: translate(-50%, -50%) translateZ(750px);
  }
  100% {
    transform: translate(-50%, -50%) translateZ(795px);
  }
}

.layer-1 {
  animation-delay: 0s;
}
.layer-2 {
  animation-delay: -0.4s;
}
.layer-3 {
  animation-delay: -0.8s;
}
.layer-4 {
  animation-delay: -1.2s;
}
.layer-5 {
  animation-delay: -1.6s;
}
.layer-6 {
  animation-delay: -2s;
}
.layer-7 {
  animation-delay: -2.4s;
}
.layer-8 {
  animation-delay: -4s;
}

.gate-layer :deep(path) {
  fill: var(--p-primary-500);
}

.convergence-overlay {
  position: fixed;
  inset: 0;
  z-index: 51;
  opacity: 0;
  pointer-events: none;
  animation: overlay-converge 0.6s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  animation-delay: 3.2s;
}

@keyframes overlay-converge {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
