<script setup lang="ts">
import credibility from '../content/credibility.json'
import Icon from './Icon.vue'
withDefaults(defineProps<{ demo?: boolean }>(), { demo: true })
</script>

<template>
  <section id="approach" class="expertise-section section-space" aria-labelledby="approach-title">
    <div class="section-wrap">
      <div class="expertise-heading reveal">
        <div class="eyebrow"><span class="section-number">04 /</span> THE WAY I WORK</div>
        <h2 id="approach-title">Engineering with <br><span class="serif-word">a little more intention.</span></h2>
      </div>
      <div class="expertise-layout">
        <div class="focus-card reveal" data-spotlight>
          <div class="focus-card-header"><div><span class="focus-kicker">FROM INTERFACE TO INFRASTRUCTURE</span><h3>Connected thinking.</h3></div><span class="focus-emblem" aria-hidden="true"><Icon name="layers" :size="27" /></span></div>
          <div class="focus-rows">
            <div v-for="(focus,index) in credibility.focus" :key="focus.name" class="focus-row">
              <div class="focus-row-label"><span>{{ focus.name }}</span><small>{{ focus.label }}</small></div>
              <div class="focus-track" aria-hidden="true"><span class="focus-fill" :style="{ width: focus.width, '--bar-delay': `${index * 90}ms` }"></span></div>
            </div>
          </div>
          <div class="focus-card-footer"><span class="focus-dot"></span><span>{{ demo ? 'Illustrative focus profile' : 'A connected engineering approach' }}</span><span class="focus-footer-cross" aria-hidden="true">✳</span></div>
        </div>
        <div class="expertise-copy reveal">
          <span class="expertise-note">ONE PERSON. A CONNECTED PERSPECTIVE.</span>
          <p class="expertise-lead">{{ credibility.introduction }}</p>
          <p>{{ credibility.approach }}</p>
          <ul class="expertise-checklist"><li v-for="item in credibility.checklist" :key="item"><span class="check-circle"><Icon name="check" :size="12" /></span>{{ item }}</li></ul>
          <a class="text-link expertise-link" href="#contact">Let’s talk through your idea <Icon name="arrow" :size="17" /></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.expertise-section{background:var(--soft);border-top:1px solid var(--line);border-bottom:1px solid var(--line);position:relative}.expertise-heading{margin-bottom:48px}.expertise-heading h2{margin-top:19px;max-width:850px}.expertise-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.02fr);gap:76px;align-items:center}.focus-card{padding:31px 32px 0;background:var(--card);border:1px solid var(--line);border-radius:10px;position:relative;overflow:hidden;isolation:isolate;box-shadow:0 12px 38px #25272403}.focus-card::before{content:'';position:absolute;inset:0;background:radial-gradient(260px circle at var(--spot-x,50%) var(--spot-y,50%),#ed583a0b,transparent 70%);opacity:0;transition:opacity .35s;z-index:-1}.focus-card:hover::before{opacity:1}.focus-card-header{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:31px;border-bottom:1px solid var(--line)}.focus-kicker{font-size:13px;letter-spacing:.12em;color:var(--muted);display:block}.focus-card h3{font-size:25px;letter-spacing:-.045em;margin-top:11px}.focus-emblem{height:47px;width:47px;border-radius:50%;color:var(--coral);border:1px solid #ed583a32;display:grid;place-items:center;flex-shrink:0;transition:transform .5s}.focus-card:hover .focus-emblem{transform:rotate(-12deg)}.focus-rows{padding:28px 0 26px}.focus-row+.focus-row{margin-top:22px}.focus-row-label{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;font-size:14px;line-height:1.5}.focus-row-label>span{font-weight:500;letter-spacing:-.015em}.focus-row-label>small{font-size:13px;color:var(--coral);border:1px solid #ed583a24;border-radius:20px;padding:3px 8px;line-height:1.25}.focus-track{height:4px;background:var(--soft);border-radius:5px;overflow:hidden}.focus-fill{height:100%;display:block;border-radius:5px;transform-origin:left;background:linear-gradient(90deg,var(--coral),#dc9572)}.focus-card.is-visible .focus-fill{animation:focus-unfold 1.1s cubic-bezier(.2,.65,.3,1) var(--bar-delay,0s) both}.focus-card-footer{display:flex;align-items:center;gap:8px;font-size:14px;line-height:1.4;color:var(--muted);padding:17px 0;border-top:1px solid var(--line)}.focus-dot{width:5px;height:5px;background:var(--coral);border-radius:50%}.focus-footer-cross{margin-left:auto;color:var(--coral);font-size:18px;line-height:1}.expertise-note{display:block;font-size:14px;letter-spacing:.12em;color:var(--coral);margin-bottom:21px}.expertise-copy>p{font-size:14px;line-height:1.85;color:var(--muted);max-width:550px}.expertise-copy>p.expertise-lead{font-size:18px;line-height:1.65;letter-spacing:-.025em;color:var(--ink)}.expertise-copy>p+p{margin-top:18px}.expertise-checklist{list-style:none;padding:0;margin:26px 0 0;display:grid;gap:11px}.expertise-checklist li{display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.6}.check-circle{height:17px;width:17px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;background:#ed583a13;color:var(--coral);margin-top:1px}.expertise-link{margin-top:27px}@keyframes focus-unfold{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media(max-width:1100px){.expertise-layout{gap:45px}.focus-card{padding:27px 25px 0}.expertise-copy>p.expertise-lead{font-size:17px}}@media(max-width:860px){.expertise-layout{gap:32px}.focus-card{padding:24px 22px 0}.focus-kicker{font-size:13px;letter-spacing:.1em}.focus-emblem{width:39px;height:39px}.focus-card h3{font-size:21px}.focus-row-label{font-size:14px}.focus-row-label>small{font-size:13px;padding:3px 6px}.expertise-copy>p{font-size:16px}.expertise-copy>p.expertise-lead{font-size:16px}.expertise-checklist li{font-size:14px}.expertise-heading{margin-bottom:35px}}@media(max-width:640px){.expertise-layout{grid-template-columns:minmax(0,1fr);gap:32px}.expertise-heading{margin-bottom:30px}.expertise-heading h2{font-size:clamp(33px,8.9vw,45px)}.focus-card{padding:25px 24px 0}.focus-card-header{padding-bottom:25px}.focus-kicker{font-size:13px}.focus-card h3{font-size:25px}.focus-row-label{font-size:14px}.focus-row-label>small{font-size:13px}.focus-card-footer{font-size:14px}.expertise-copy>p.expertise-lead{font-size:18px;line-height:1.7}.expertise-copy>p{font-size:14px}.expertise-note{font-size:14px;margin-bottom:16px}.expertise-checklist li{font-size:14px}.expertise-link{font-size:14px}.focus-rows{padding-top:25px}}@media(prefers-reduced-motion:reduce){.focus-card.is-visible .focus-fill{animation:none}.focus-emblem,.focus-card::before{transition:none}}
</style>
