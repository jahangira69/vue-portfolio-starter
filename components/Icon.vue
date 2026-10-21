<script setup lang="ts">
withDefaults(defineProps<{ name?: string; size?: number | string }>(), { name: 'arrow', size: 20 })
</script>
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-if="name === 'arrow'" d="M5 19 19 5M5 5h14v14" />
    <path v-else-if="name === 'right'" d="M4 12h16m-6-6 6 6-6 6" />
    <path v-else-if="name === 'down'" d="M12 4v16m-6-6 6 6 6-6" />
    <path v-else-if="name === 'close'" d="m6 6 12 12M6 18 18 6" />
    <path v-else-if="name === 'menu'" d="M4 7h16M4 12h16M4 17h16" />
    <path v-else-if="name === 'code'" d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />
    <g v-else-if="name === 'layers'"><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></g>
    <g v-else-if="name === 'spark'"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /></g>
    <g v-else-if="name === 'sun'"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></g>
    <path v-else-if="name === 'moon'" d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />
    <g v-else-if="name === 'mail'"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7" /></g>
    <g v-else-if="name === 'check'"><path d="m5 12 4 4L19 6"/></g>
    <g v-else-if="name === 'globe'"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></g>
    <g v-else-if="name === 'github'"><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a5 5 0 0 0-1.3-3.5A4.5 4.5 0 0 0 18.6 2S17.5 1.7 15 3.3a13 13 0 0 0-6 0C6.5 1.7 5.4 2 5.4 2a4.5 4.5 0 0 0-.1 3.5A5 5 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4"/></g>
    <path v-else-if="name === 'x'" d="m4 3 16 18h-5L3 3h5L20 21M20 3 4 21" />
    <g v-else-if="name === 'linkedin'"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-10v.01M11 17v-7m0 3c0-4 6-4 6 0v4"/></g>
  </svg>
</template>
