<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const enabled = ref(false)
const visible = ref(false)
const interactive = ref(false)
const cursor = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
let pointerMedia: MediaQueryList | undefined
let motionMedia: MediaQueryList | undefined
let frame = 0
let pointerX = -100, pointerY = -100, ringX = -100, ringY = -100
let currentEvent: PointerEvent | null = null
let spotlight: HTMLElement | null = null
let tilt: HTMLElement | null = null
let hero: HTMLElement | null = null
let heroTargetX = 0, heroTargetY = 0, heroX = 0, heroY = 0
let listening = false
function resetTarget() {
  tilt?.style.removeProperty('--tilt-x')
  tilt?.style.removeProperty('--tilt-y')
  tilt = null
  spotlight = null
}
function animate() {
  frame = 0
  ringX += (pointerX - ringX) * .22
  ringY += (pointerY - ringY) * .22
  heroX += (heroTargetX - heroX) * .09
  heroY += (heroTargetY - heroY) * .09
  cursor.value?.style.setProperty('transform', `translate3d(${ringX}px,${ringY}px,0)`)
  dot.value?.style.setProperty('transform', `translate3d(${pointerX}px,${pointerY}px,0)`)
  if (hero) {
    hero.style.setProperty('--pointer-x', String(heroX))
    hero.style.setProperty('--pointer-y', String(heroY))
  }
  if (currentEvent) {
    const target = currentEvent.target instanceof Element ? currentEvent.target : null
    const nextSpot = target?.closest<HTMLElement>('[data-spotlight]') || null
    const nextTilt = target?.closest<HTMLElement>('[data-tilt]') || null
    if (nextTilt !== tilt) resetTarget()
    spotlight = nextSpot
    tilt = nextTilt
    if (spotlight) {
      const rect = spotlight.getBoundingClientRect()
      spotlight.style.setProperty('--spot-x', `${pointerX - rect.left}px`)
      spotlight.style.setProperty('--spot-y', `${pointerY - rect.top}px`)
    }
    if (tilt) {
      const rect = tilt.getBoundingClientRect()
      tilt.style.setProperty('--tilt-x', `${((pointerY - rect.top) / rect.height - .5) * -5}deg`)
      tilt.style.setProperty('--tilt-y', `${((pointerX - rect.left) / rect.width - .5) * 5}deg`)
    }
    currentEvent = null
  }
  if (Math.abs(pointerX-ringX) + Math.abs(pointerY-ringY) > .12 || Math.abs(heroTargetX-heroX)+Math.abs(heroTargetY-heroY) > .002) frame = requestAnimationFrame(animate)
}
function move(event: PointerEvent) {
  if (event.pointerType && event.pointerType !== 'mouse') { leave(); return }
  const target = event.target instanceof Element ? event.target : null
  const overForm = Boolean(target?.closest('input, textarea, select, dialog'))
  visible.value = !overForm
  interactive.value = Boolean(target?.closest('a, button, [role="tab"]'))
  pointerX = event.clientX
  pointerY = event.clientY
  if (ringX < 0) { ringX = pointerX; ringY = pointerY }
  currentEvent = event
  const insideHero = Boolean(target?.closest('#home'))
  heroTargetX = insideHero ? event.clientX / innerWidth * 2 - 1 : 0
  heroTargetY = insideHero ? event.clientY / innerHeight * 2 - 1 : 0
  if (!frame) frame = requestAnimationFrame(animate)
}
function leave() {
  visible.value = false
  currentEvent = null
  resetTarget()
  heroTargetX = 0
  heroTargetY = 0
  if (enabled.value && !frame) frame = requestAnimationFrame(animate)
}
function toggleListeners() {
  enabled.value = Boolean(pointerMedia?.matches && motionMedia?.matches)
  if (enabled.value && !listening) {
    document.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    listening = true
  } else if (!enabled.value && listening) stop()
}
function stop() {
  document.removeEventListener('pointermove', move)
  document.documentElement.removeEventListener('pointerleave', leave)
  window.removeEventListener('blur', leave)
  listening = false
  visible.value = false
  currentEvent = null
  resetTarget()
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  hero?.style.removeProperty('--pointer-x')
  hero?.style.removeProperty('--pointer-y')
}
onMounted(() => {
  hero = document.querySelector<HTMLElement>('.hero-visual')
  pointerMedia = matchMedia('(hover: hover) and (pointer: fine)')
  motionMedia = matchMedia('(prefers-reduced-motion: no-preference)')
  pointerMedia.addEventListener('change', toggleListeners)
  motionMedia.addEventListener('change', toggleListeners)
  toggleListeners()
})
onBeforeUnmount(() => {
  stop()
  pointerMedia?.removeEventListener('change', toggleListeners)
  motionMedia?.removeEventListener('change', toggleListeners)
})
</script>
<template>
  <div v-if="enabled" :class="['pointer-experience', { 'pointer-visible': visible, 'pointer-interactive': interactive }]" aria-hidden="true">
    <div ref="cursor" class="pointer-ring"><span></span></div>
    <div ref="dot" class="pointer-dot"><span></span></div>
  </div>
</template>
<style scoped>
.pointer-experience{pointer-events:none!important;position:fixed;inset:0;z-index:100;opacity:0;transition:opacity .2s;contain:layout style;overflow:hidden}
.pointer-visible{opacity:1}.pointer-ring,.pointer-dot{position:absolute;top:0;left:0;will-change:transform;pointer-events:none}
.pointer-ring span{display:block;width:30px;height:30px;border:1px solid var(--coral);border-radius:50%;margin:-15px 0 0 -15px;opacity:.55;transition:width .3s,height .3s,margin .3s,background .3s;box-shadow:0 0 16px #ed583a0a}
.pointer-dot span{display:block;width:4px;height:4px;background:var(--coral);border-radius:50%;margin:-2px 0 0 -2px;opacity:.85}
.pointer-interactive .pointer-ring span{width:48px;height:48px;margin:-24px 0 0 -24px;background:#ed583a0b;opacity:.75}
@media(hover:none),(pointer:coarse),(prefers-reduced-motion:reduce){.pointer-experience{display:none}}
</style>
