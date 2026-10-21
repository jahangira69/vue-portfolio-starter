<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import serviceGroups from '../content/services.json'
import Icon from './Icon.vue'
withDefaults(defineProps<{ demo?: boolean }>(), { demo: true })
const activeTab = ref(0)
const activeGroup = computed(() => serviceGroups[activeTab.value] || serviceGroups[0]!)
const tabButtons = ref<Array<HTMLButtonElement | null>>([])
function setButton(element: unknown, index: number) { tabButtons.value[index] = element as HTMLButtonElement | null }
async function onTabKey(event: KeyboardEvent, index: number) {
  let target = index
  if (event.key === 'ArrowRight') target = (index + 1) % serviceGroups.length
  else if (event.key === 'ArrowLeft') target = (index - 1 + serviceGroups.length) % serviceGroups.length
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = serviceGroups.length - 1
  else return
  event.preventDefault()
  activeTab.value = target
  await nextTick()
  tabButtons.value[target]?.focus()
}
</script>

<template>
  <section id="services" class="services-section section-space" aria-labelledby="services-title">
    <div class="section-wrap">
      <div class="section-heading reveal">
        <div><div class="eyebrow"><span class="section-number">02 /</span> WHAT I CAN HELP WITH</div><h2 id="services-title">Good thinking. <br><span class="serif-word">Useful software.</span></h2></div>
        <p>A considered approach to the interface, <br>the system, and everything in between.</p>
      </div>
      <div class="services-controls reveal">
        <div class="service-tabs" role="tablist" aria-label="Explore service areas">
          <button v-for="(group,index) in serviceGroups" :id="`service-tab-${group.id}`" :key="group.id" :ref="element => setButton(element,index)" type="button" role="tab" :class="{ 'is-active': activeTab === index }" :tabindex="activeTab === index ? 0 : -1" :aria-selected="activeTab === index" :aria-controls="`service-panel-${group.id}`" @click="activeTab=index" @keydown="onTabKey($event,index)"><Icon :name="group.icon" :size="16"/><span>{{ group.label }}</span></button>
        </div>
        <span class="services-count"><span class="count-line"></span> 03 DISCIPLINES · ONE CONSIDERED APPROACH</span>
      </div>
      <Transition name="service-panel" mode="out-in">
        <div :id="`service-panel-${activeGroup.id}`" :key="activeGroup.id" class="service-panel" role="tabpanel" :aria-labelledby="`service-tab-${activeGroup.id}`" tabindex="0">
          <p class="panel-intro"><span class="panel-intro-mark" aria-hidden="true">↳</span>{{ activeGroup.intro }}</p>
          <div class="services-grid">
            <article v-for="(service,index) in activeGroup.services" :key="service.id" class="service-card" data-spotlight :style="{'--service-delay':`${index * 35}ms`}">
              <div class="service-card-top"><span class="service-icon"><Icon :name="service.icon" :size="23" /></span><span class="service-card-number">0{{ index + 1 }}</span></div>
              <h3>{{ service.title }}</h3><p>{{ service.description }}</p>
              <div class="service-tags"><span v-for="tag in service.tags" :key="tag">{{ tag }}</span></div>
              <span class="service-card-corner" aria-hidden="true"><Icon name="arrow" :size="18" /></span>
            </article>
          </div>
        </div>
      </Transition>
      <div class="services-bottom"><p v-if="demo" class="services-demo-note">Illustrative capability overview. I’ll tailor these services to Jordan’s confirmed expertise before launch.</p><a href="#contact" class="text-link">Let’s find the right starting point <Icon name="arrow" :size="17" /></a></div>
    </div>
  </section>
</template>

<style scoped>
.services-section{border-top:1px solid var(--line);background:var(--bg)}.services-section .section-heading{margin-bottom:35px}.services-section .section-heading>p{max-width:330px;font-size:14px}.services-section .eyebrow{font-size:13px;letter-spacing:.12em;gap:10px}.services-controls{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.service-tabs{display:inline-flex;align-items:stretch;border:1px solid var(--line);border-radius:5px;padding:4px;gap:3px;background:var(--soft);max-width:100%}.service-tabs button{background:transparent;padding:12px 18px;border-radius:3px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:9px;color:var(--muted);font-weight:500;transition:background .25s,color .25s,box-shadow .25s;min-height:44px;white-space:nowrap}.service-tabs button:hover{color:var(--ink);background:var(--card)}.service-tabs button.is-active{color:#fff;background:var(--coral);box-shadow:0 3px 9px #ed583a20}.services-count{font-size:13px;letter-spacing:.11em;color:var(--muted);display:flex;align-items:center;gap:10px;white-space:nowrap}.count-line{width:22px;height:1px;background:var(--coral)}.panel-intro{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--muted);margin-bottom:22px}.panel-intro-mark{font-size:19px;color:var(--coral);line-height:1}.services-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;align-items:stretch}.service-card{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:7px;isolation:isolate;background:var(--card);padding:25px 23px 26px;display:flex;flex-direction:column;min-width:0;transition:transform .35s cubic-bezier(.2,.6,.3,1),border-color .35s,box-shadow .35s;animation:service-card-enter .45s var(--service-delay) backwards}.service-card::before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(230px circle at var(--spot-x,50%) var(--spot-y,0%),#ed583a0d,transparent 75%);opacity:0;transition:opacity .35s;pointer-events:none}.service-card:hover{transform:translateY(-6px);border-color:#ed583a55;box-shadow:0 12px 30px #26271e08}.service-card:hover::before{opacity:1}.service-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px}.service-icon{display:grid;place-items:center;width:43px;height:43px;border-radius:8px;color:var(--coral);background:#ed583a0a;border:1px solid #ed583a24;transition:transform .4s,background .4s}.service-card:hover .service-icon{transform:rotate(-8deg);background:#ed583a15}.service-card-number{font-family:monospace;color:var(--muted);font-size:13px;opacity:.65}.service-card h3{font-size:19px;line-height:1.25;letter-spacing:-.035em;margin-bottom:12px}.service-card>p{font-size:14px;line-height:1.8;color:var(--muted);margin-bottom:22px;flex:1}.service-tags{display:flex;flex-wrap:wrap;gap:6px;align-content:start;margin-top:auto;padding-right:0}.service-tags>span{font-size:13px;line-height:1.45;padding:4px 7px;border-radius:3px;background:var(--soft);border:1px solid var(--line);color:var(--muted);white-space:normal}.service-card-corner{position:absolute;top:29px;right:23px;color:var(--coral);opacity:0;transform:translate(-5px,5px);transition:opacity .3s,transform .3s}.service-card:hover .service-card-number{opacity:0}.service-card:hover .service-card-corner{opacity:1;transform:translate(0)}.services-bottom{display:flex;align-items:center;justify-content:space-between;gap:25px;margin-top:27px}.services-demo-note{font-size:14px;line-height:1.75;color:var(--muted);max-width:410px}.services-bottom>.text-link{font-size:15px;flex-shrink:0}.service-panel-enter-active,.service-panel-leave-active{transition:opacity .18s,transform .18s}.service-panel-enter-from,.service-panel-leave-to{opacity:0;transform:translateY(7px)}.service-panel:focus{outline-offset:7px}.service-panel:focus:not(:focus-visible){outline:none}@keyframes service-card-enter{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1150px){.services-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.services-count{font-size:13px}.service-card{padding:23px 20px}.service-card>p{font-size:16px}.service-card h3{font-size:18px}}
@media(max-width:900px){.services-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.services-count{display:none}.services-section .section-heading>p{font-size:15px}.services-bottom{align-items:flex-start;flex-direction:column;gap:16px}.service-card>p{font-size:14px}.service-card h3{font-size:20px}.service-tags>span{font-size:13px}}
@media(max-width:640px){.services-section .eyebrow{font-size:13px;gap:7px;flex-wrap:wrap}.services-section .section-number{font-size:13px}.services-section .section-heading{margin-bottom:25px}.services-section .section-heading>p{font-size:16px}.service-tabs{display:grid;grid-template-columns:1fr 1fr 1.4fr;width:100%;padding:3px;gap:2px}.service-tabs button{font-size:14px;padding:11px 6px;gap:6px}.service-tabs button svg{width:14px}.services-controls{margin-bottom:18px}.panel-intro{font-size:15px;align-items:flex-start;margin-bottom:19px}.services-grid{grid-template-columns:minmax(0,1fr);gap:13px}.service-card{padding:24px}.service-card-top{margin-bottom:22px}.service-card h3{font-size:22px}.service-card>p{font-size:14px;line-height:1.8;margin-bottom:21px}.service-tags>span{font-size:13px;padding:4px 8px}.services-demo-note{font-size:14px}.services-bottom{margin-top:22px}.services-bottom>.text-link{font-size:15px}.service-card-corner{right:24px}}
@media(max-width:360px){.service-tabs button{font-size:14px;gap:4px;padding-inline:4px}.service-tabs button svg{width:12px}.service-card{padding:22px}.service-card h3{font-size:21px}}
@media(prefers-reduced-motion:reduce){.service-card,.service-icon,.service-card-corner,.service-panel-enter-active,.service-panel-leave-active{animation:none!important;transition:none!important}.service-card:hover{transform:none}.service-card:hover .service-icon{transform:none}}
</style>
