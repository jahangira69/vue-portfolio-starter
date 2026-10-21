<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
const props = withDefaults(defineProps<{ github?: string; linkedin?: string; x?: string; email?: string; compact?: boolean }>(), { github:'', linkedin:'', x:'', email:'', compact:false })
const safe = (value: string) => /^https?:\/\//.test(value) ? value : ''
const profiles = computed(() => [
  { name:'GitHub', icon:'github', url:safe(props.github) },
  { name:'LinkedIn', icon:'linkedin', url:safe(props.linkedin) },
  { name:'X', icon:'x', url:safe(props.x) },
  { name:'Email', icon:'mail', url:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email) ? `mailto:${props.email}` : '' }
])
</script>
<template>
  <div :class="['social-links', { compact }]" role="group" aria-label="Social profiles">
    <template v-for="profile in profiles" :key="profile.name">
      <a v-if="profile.url" :href="profile.url" :aria-label="profile.name" :target="profile.icon === 'mail' ? undefined : '_blank'" rel="noopener noreferrer" class="social-profile" data-spotlight><Icon :name="profile.icon" :size="18" /><span v-if="!compact">{{ profile.name }}</span><Icon v-if="!compact" name="arrow" :size="12" /></a>
      <span v-else class="social-profile social-pending" :aria-label="`${profile.name} profile — link coming soon`" :title="`${profile.name} link coming soon`"><Icon :name="profile.icon" :size="18" /><span v-if="!compact">{{ profile.name }}</span><span class="pending-dot"></span></span>
    </template>
  </div>
</template>
<style scoped>
.social-links{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.social-profile{min-height:43px;min-width:43px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border:1px solid var(--line);border-radius:4px;padding:11px 13px;font-size:14px;background:transparent;transition:color .25s,border-color .25s,background .25s,transform .25s;position:relative}
a.social-profile:hover{color:var(--coral);border-color:var(--coral);background:#ed583a07;transform:translateY(-3px)}.social-profile>svg:last-child{margin-left:2px}.compact .social-profile{padding:10px}.social-pending{color:var(--muted);border-style:dashed}.pending-dot{width:3px;height:3px;position:absolute;right:5px;bottom:5px;border-radius:50%;background:currentColor;opacity:.5}.compact .social-profile>svg:last-child{margin:0}
@media(prefers-reduced-motion:reduce){.social-profile{transition:none}}
</style>
