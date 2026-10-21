<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import site from '../content/site.json'
import projects from '../content/projects.json'
import Icon from './Icon.vue'
import ProjectArtwork from './ProjectArtwork.vue'
import ServicesSection from './ServicesSection.vue'
import ExpertiseSection from './ExpertiseSection.vue'
import TechnologiesSection from './TechnologiesSection.vue'
import TestimonialsSection from './TestimonialsSection.vue'
import MotionExperience from './MotionExperience.vue'
import SocialLinks from './SocialLinks.vue'
const props = withDefaults(defineProps<{ offline?: boolean }>(), { offline: false })
type Project = typeof projects[number]
const filters = computed(() => ['All work', ...new Set(projects.map(project => project.category))])
const filter = ref('All work')
const filteredProjects = computed(() => projects.filter(p => filter.value === 'All work' || p.category === filter.value))
const menuOpen = ref(false)
const dark = ref(false)
const activeSection = ref('home')
const progress = ref(0)
const year = new Date().getFullYear()
const selected = ref<Project | null>(null)
const caseDialog = ref<HTMLDialogElement | null>(null)
const contactStatus = ref('')
const contactError = ref(false)
const sending = ref(false)
const form = ref({ name: '', email: '', projectType: 'Website / web app', budget: 'Let’s discuss', message: '', website: '' })
const safeImage = (url: string) => /^(https?:\/\/|\/(?!\/)|\.\/|data:image\/(?:png|jpeg|webp|gif|avif|svg\+xml);base64,)/.test(url) ? url : ''
const profileEmail = computed(() => site.email.trim())
let revealObserver: IntersectionObserver | undefined
let sectionObserver: IntersectionObserver | undefined
let lastFocused: HTMLElement | null = null
const safeUrl = (url: string) => /^(https?:\/\/|mailto:|\/(?!\/)|\.\/)/.test(url) ? url : ''
function navigate() { menuOpen.value = false }
function applyTheme() {
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
  try { localStorage.setItem('jordan-theme', dark.value ? 'dark' : 'light') } catch { /* local files may deny storage */ }
}
function toggleTheme() { dark.value = !dark.value; applyTheme() }
async function openProject(project: Project) {
  lastFocused = document.activeElement as HTMLElement
  selected.value = project
  await nextTick()
  caseDialog.value?.showModal()
  document.body.style.overflow = 'hidden'
}
function closeProject() {
  caseDialog.value?.close()
}
function onDialogClosed() {
  document.body.style.overflow = ''
  selected.value = null
  lastFocused?.focus()
}
function onKey(event: KeyboardEvent) { if (event.key === 'Escape') menuOpen.value = false }
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight
  progress.value = max > 0 ? scrollY / max : 0
}
function revealElements() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => revealObserver?.observe(el))
}
async function sendMessage() {
  if (sending.value) return
  contactStatus.value = ''
  contactError.value = false
  if (props.offline || site.contactMode !== 'smtp') {
    if (!profileEmail.value) {
      contactError.value = true
      contactStatus.value = 'This preview is not connected to Jordan’s inbox yet. Add the contact email in the content editor before launch.'
      return
    }
    const subject = `Portfolio inquiry — ${form.value.projectType}`
    const body = `Name: ${form.value.name}\nEmail: ${form.value.email}\nProject: ${form.value.projectType}\nBudget: ${form.value.budget}\n\n${form.value.message}`
    window.location.href = `mailto:${encodeURIComponent(profileEmail.value)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    contactStatus.value = 'Your email app has been opened with the message prepared. Send it there to complete your inquiry.'
    return
  }
  sending.value = true
  try {
    const response = await fetch(site.contactEndpoint || '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || result.sent !== true) throw new Error(result.statusMessage || result.message || 'Your message could not be sent. Please try again later.')
    contactStatus.value = 'Message sent. Thank you for reaching out!'
    form.value = { name: '', email: '', projectType: 'Website / web app', budget: 'Let’s discuss', message: '', website: '' }
  } catch (error) {
    contactError.value = true
    contactStatus.value = error instanceof Error ? error.message : 'Your message could not be sent. Please try again.'
  } finally { sending.value = false }
}
watch(filter, async () => { await nextTick(); revealElements() })
watch(menuOpen, value => { if (typeof document !== 'undefined') document.body.classList.toggle('menu-is-open', value) })
onMounted(() => {
  try { dark.value = localStorage.getItem('jordan-theme') === 'dark' } catch { /* optional preference */ }
  applyTheme()
  document.documentElement.classList.add('enhanced')
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver?.unobserve(entry.target) } }), { threshold: 0.08 })
  revealElements()
  sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) activeSection.value = entry.target.id }), { rootMargin: '-15% 0px -55% 0px', threshold: 0 })
  document.querySelectorAll('main > section[id]').forEach(el => sectionObserver?.observe(el))
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('keydown', onKey)
  onScroll()
})
onBeforeUnmount(() => { revealObserver?.disconnect(); sectionObserver?.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('keydown', onKey); document.body.style.overflow = ''; document.body.classList.remove('menu-is-open') })
</script>

<template>
  <div class="portfolio-shell">
    <MotionExperience />
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="reading-progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true"></div>
    <header class="site-header">
      <a class="wordmark" href="#home" aria-label="Jordan Shumate home" @click="navigate"><span class="brand-mark">j<span>.</span></span><span>{{ site.name.toLowerCase() }}<span class="wordmark-dot">.</span></span></a>
      <nav id="mobile-navigation" :class="['main-nav', { 'is-open': menuOpen }]" aria-label="Main navigation">
        <a v-for="item in [{id:'work',label:'Work'},{id:'services',label:'Services'},{id:'about',label:'About'},{id:'experience',label:'Experience'}]" :key="item.id" :href="`#${item.id}`" :class="{active:activeSection === item.id}" @click="navigate">{{ item.label }}<span class="nav-dot"></span></a>
        <a href="#contact" class="nav-contact" @click="navigate">Let’s talk <Icon name="arrow" :size="15" /></a>
      </nav>
      <div class="header-tools"><button class="theme-button" :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme"><Icon :name="dark ? 'sun' : 'moon'" :size="18" /></button><button class="menu-button" :aria-expanded="menuOpen" aria-controls="mobile-navigation" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" @click="menuOpen = !menuOpen"><Icon :name="menuOpen ? 'close' : 'menu'" /></button></div>
    </header>

    <main id="main">
      <section id="home" class="hero section-wrap">
        <div class="hero-copy">
          <div class="eyebrow hero-enter"><span class="tiny-cross">✳</span> {{ site.role.toUpperCase() }}</div>
          <h1 class="hero-title"><span class="hero-line">Good ideas.</span><span class="hero-line">Great <span class="serif-word">execution.</span><svg class="title-underline" viewBox="0 0 470 22" aria-hidden="true"><path d="M5 15Q180-5 462 11M40 21Q240 2 440 17"/></svg></span></h1>
          <p class="hero-description hero-enter">{{ site.intro }}</p>
          <div class="hero-actions hero-enter"><a class="button button-dark" href="#work">Explore my work <Icon name="arrow" :size="18" /></a><a class="text-link" href="#about">A little about me <Icon name="right" :size="17" /></a></div>
          <div class="hero-location hero-enter"><span class="location-dot"></span> BASED IN {{ site.location === 'United States' ? 'THE UNITED STATES' : site.location.toUpperCase() }} <span class="location-slash">/</span> BUILDING FOR THE WEB</div>
        </div>
        <div class="hero-visual" aria-label="Abstract interface composition: thoughtful design meets dependable code" role="img">
          <div class="visual-grid"></div><div class="visual-orbit orbit-one"></div><div class="visual-orbit orbit-two"></div>
          <div class="floating-label label-one"><span class="green-dot"></span> Built with intention</div>
          <div class="editor-card"><div class="editor-bar"><span></span><span></span><span></span><small>the good stuff.ts</small><Icon name="code" :size="14" /></div><div class="editor-code"><div><i>01</i> <span class="code-purple">const</span> experience = {</div><div><i>02</i> &nbsp; design: <span class="code-green">'thoughtful'</span>,</div><div><i>03</i> &nbsp; details: <span class="code-green">'considered'</span>,</div><div><i>04</i> &nbsp; possibilities: <span class="code-orange">Infinity</span></div><div><i>05</i> }<span class="code-cursor">|</span></div></div></div>
          <div class="sculpture-card"><span class="micro">A LITTLE FORM. A LOT OF FUNCTION.</span><div class="sculpture"><div class="sculpture-ring ring-a"></div><div class="sculpture-ring ring-b"></div><div class="sculpture-ring ring-c"></div><div class="sculpture-shadow"></div></div><div class="sculpture-footer"><span>Ideas, brought to life.</span><span class="square-arrow"><Icon name="arrow" :size="17" /></span></div></div>
          <div class="floating-label label-two"><span class="label-icon"><Icon name="check" :size="15" /></span> Details make the difference.</div>
          <div class="visual-coordinate">JS — DESIGN × ENGINEERING</div><span class="visual-star">✳</span>
        </div>
        <div class="hero-bottom"><a href="#work" class="scroll-link"><span class="scroll-circle"><Icon name="down" :size="15" /></span> SCROLL TO EXPLORE</a><span>LESS NOISE. MORE PURPOSE.</span></div>
      </section>

      <div class="craft-strip" aria-label="Focus areas"><div class="craft-strip-track"><span>Considered design</span><b>✳</b><span>Clean code</span><b>✳</b><span>Meaningful interactions</span><b>✳</b><span>Built for people</span><b>✳</b><span>Considered design</span><b>✳</b><span>Clean code</span><b>✳</b><span>Meaningful interactions</span><b>✳</b><span>Built for people</span><b>✳</b></div></div>

      <section id="work" class="work-section section-wrap section-space">
        <div class="section-heading reveal"><div><div class="eyebrow"><span class="section-number">01 /</span> SELECTED WORK</div><h2>A few things <br>worth <span class="serif-word">a closer look.</span></h2></div><p>A collection of interfaces, ideas, <br>and the thinking that connects them.</p></div>
        <div class="work-toolbar reveal"><div class="filter-list" role="group" aria-label="Filter projects"><button v-for="item in filters" :key="item" :class="['filter-button',{selected: filter === item}]" :aria-pressed="filter === item" @click="filter = item">{{ item }}<span v-if="item === 'All work'" class="filter-count">{{ projects.length }}</span></button></div><span class="concept-note" v-if="site.demoContent">ILLUSTRATIVE PROJECTS</span></div>
        <TransitionGroup name="projects" tag="div" class="project-grid" aria-live="polite">
          <article v-for="(project,index) in filteredProjects" :key="project.id" class="project-card reveal is-visible" :style="{'--card-delay':`${index % 2 * 100}ms`}">
            <button class="project-art-button" data-tilt :aria-label="`Read the ${project.name} case study`" @click="openProject(project)"><img v-if="safeImage(project.image)" class="project-image" :src="safeImage(project.image)" :alt="project.imageAlt || `${project.name} project screenshot`" loading="lazy" width="1000" height="704"><ProjectArtwork v-else :kind="project.kind" /><span class="project-hover-label">View case study <Icon name="arrow" :size="19" /></span></button>
            <div class="project-meta"><div><span class="project-category">{{ project.category }} <span> / </span> {{ project.year }}</span><button class="project-title" @click="openProject(project)">{{ project.name }} <Icon name="arrow" :size="22" /></button></div><span class="project-index">0{{ projects.findIndex(p=>p.id===project.id)+1 }}</span></div>
            <p class="project-description">{{ project.description }}</p><div class="project-tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div>
          </article>
        </TransitionGroup>
        <p class="work-footnote reveal"><span class="small-star">✳</span> Every good project starts with a conversation. <a href="#contact">Let’s start one <Icon name="arrow" :size="14" /></a></p>
      </section>

      <ServicesSection :demo="site.demoContent" />

      <section id="about" class="about-section section-space">
        <div class="section-wrap about-grid"><div class="about-visual reveal"><div class="about-label">THE PERSON BEHIND THE PIXELS</div><div class="monogram-art" aria-hidden="true"><span>j</span><span>s<span class="monogram-period">.</span></span><div class="monogram-orbit"></div><span class="monogram-star">✳</span></div><div class="about-card-bottom"><span>{{ site.name.toUpperCase() }}</span><span><Icon name="globe" :size="14" /> {{ site.location.toUpperCase() }}</span></div></div><div class="about-copy reveal"><div class="eyebrow"><span class="section-number">03 /</span> A LITTLE ABOUT ME</div><h2>Curiosity in mind. <br><span class="serif-word">Craft at heart.</span></h2><p class="about-lead">{{ site.about }}</p><p>{{ site.aboutSecondary }}</p><div class="principles"><span v-for="(principle,index) in site.principles" :key="principle"><small>0{{ index+1 }}</small> {{ principle }}</span></div><a class="text-link" href="#contact">Have something in mind? <Icon name="arrow" :size="17" /></a></div></div>
      </section>

      <ExpertiseSection :demo="site.demoContent" />

      <section id="skills" class="skills-section section-wrap section-space"><div class="section-heading reveal"><div><div class="eyebrow"><span class="section-number">05 /</span> TOOLS OF THE TRADE</div><h2>The right tools. <br><span class="serif-word">The right mindset.</span></h2></div><p>Good software takes more than a stack. <br>It takes care at every layer.</p></div><div class="skills-grid"><article v-for="(skill,index) in site.skills" :key="skill.number" class="skill-card reveal" data-spotlight><div class="skill-top"><span class="skill-icon"><Icon :name="['code','layers','spark'][index]" :size="25" /></span><span>{{ skill.number }}</span></div><h3>{{ skill.label }}</h3><p>{{ skill.description }}</p><div class="skill-tags"><span v-for="item in skill.items" :key="item">{{ item }}</span></div></article></div><p v-if="site.demoContent" class="content-note">The stack shown is illustrative and will be tailored to Jordan’s confirmed skills.</p></section>

      <TechnologiesSection :demo="site.demoContent" />

      <section id="experience" class="experience-section section-wrap section-space"><div class="experience-layout"><div class="experience-heading reveal"><div class="eyebrow"><span class="section-number">07 /</span> THE JOURNEY SO FAR</div><h2>Always building. <br><span class="serif-word">Always learning.</span></h2><p>Every chapter brings a different perspective. <br>Here’s where the work comes from.</p><a v-if="safeUrl(site.resumeUrl)" :href="safeUrl(site.resumeUrl)" class="text-link" target="_blank" rel="noopener noreferrer">View résumé <Icon name="arrow" :size="17" /></a></div><div class="timeline"><article v-for="entry in site.experience" :key="entry.title" class="timeline-entry reveal"><div class="timeline-dot" :class="{'dot-outline': !entry.verified}"></div><span class="timeline-period">{{ entry.period }}</span><h3>{{ entry.title }}</h3><span class="timeline-company">{{ entry.company }}</span><p>{{ entry.description }}</p></article></div></div></section>

      <TestimonialsSection :demo="site.demoContent" />

      <section id="contact" class="contact-section section-space"><div class="section-wrap"><div class="contact-top reveal"><div class="eyebrow"><span class="section-number">09 /</span> WHAT’S NEXT?</div><span class="contact-spark" aria-hidden="true">✳</span><h2>Something good <br>starts with <span class="serif-word">hello.</span><span class="coral-dot">●</span></h2></div><div class="contact-grid"><div class="contact-copy reveal"><p>Have a project in mind, a problem to solve, <br>or just a good idea? I’d love to hear it.</p><a v-if="profileEmail" :href="`mailto:${profileEmail}`" class="contact-email">{{ profileEmail }} <Icon name="arrow" :size="21" /></a><span v-else class="contact-location"><Icon name="globe" :size="18" /> {{ site.location }} · Working on the web</span><div class="contact-socials"><SocialLinks :github="site.githubUrl" :linkedin="site.linkedinUrl" :x="site.xUrl" :email="site.email" compact /></div><p class="contact-note" v-if="!profileEmail && site.contactMode !== 'smtp'">Design preview: contact email connection pending.</p></div><form class="contact-form reveal" @submit.prevent="sendMessage"><div class="form-row"><label>Your name <input v-model="form.name" name="name" autocomplete="name" placeholder="Alex Morgan" required minlength="2" maxlength="100"></label><label>Email address <input v-model="form.email" name="email" type="email" autocomplete="email" placeholder="alex@company.com" required maxlength="254"></label></div><div class="form-row"><label>What are you thinking?<select v-model="form.projectType" name="projectType"><option>Website / web app</option><option>Product / interface</option><option>Technical collaboration</option><option>Something else</option></select></label><label>Project budget <select v-model="form.budget" name="budget"><option>Let’s discuss</option><option>Under $1,000</option><option>$1,000 – $5,000</option><option>$5,000 – $10,000</option><option>$10,000+</option></select></label></div><label>A little about your idea <textarea v-model="form.message" name="message" placeholder="The idea, the challenge, the possibilities…" rows="3" minlength="20" maxlength="5000" required></textarea></label><label class="honeypot" aria-hidden="true">Leave this empty<input v-model="form.website" name="website" tabindex="-1" autocomplete="off"></label><div class="form-footer"><p>{{ offline || site.contactMode !== 'smtp' ? 'Opens your email app when connected.' : 'Your details are used only to reply to your inquiry.' }}</p><button class="button button-coral" type="submit" :disabled="sending">{{ sending ? 'Sending…' : 'Let’s make it happen' }} <Icon name="arrow" :size="18" /></button></div><p v-if="contactStatus" :class="['form-status',{'is-error':contactError}]" role="status" aria-live="polite">{{ contactStatus }}</p></form></div></div></section>
    </main>
    <div class="footer-connect section-wrap"><div><span class="eyebrow">FIND ME ELSEWHERE</span><p>Good conversations don’t have to end here.</p></div><SocialLinks :github="site.githubUrl" :linkedin="site.linkedinUrl" :x="site.xUrl" :email="site.email" /></div>
    <footer class="site-footer section-wrap"><a class="wordmark" href="#home"><span class="brand-mark">j<span>.</span></span><span>{{ site.name.toLowerCase() }}<span class="wordmark-dot">.</span></span></a><span>© {{ year }} {{ site.name }}. Crafted with intention.</span><a class="back-top" href="#home">BACK TO TOP <Icon name="arrow" :size="16" /></a></footer>

    <dialog ref="caseDialog" class="case-dialog" aria-labelledby="case-title" @close="onDialogClosed" @click="(event: MouseEvent) => { if(event.target === caseDialog) closeProject() }">
      <div class="case-inner" v-if="selected"><button class="dialog-close" aria-label="Close case study" @click="closeProject"><Icon name="close" :size="23" /></button><div class="case-heading"><span class="eyebrow">{{ selected.category }} / {{ selected.year }}</span><h2 id="case-title">{{ selected.name }}<span class="coral-dot">.</span></h2><p>{{ selected.eyebrow }}</p><span v-if="site.demoContent" class="case-demo-badge">Illustrative concept case study</span></div><img v-if="safeImage(selected.image)" class="project-image" :src="safeImage(selected.image)" :alt="selected.imageAlt || `${selected.name} project screenshot`" width="1000" height="704"><ProjectArtwork v-else :kind="selected.kind" variant="large" /><div class="case-facts"><div><small>ROLE</small><p>{{ selected.role }}</p></div><div><small>CONTEXT</small><p>{{ selected.duration }}</p></div><div><small>TOOLKIT</small><p>{{ selected.tags.join(' · ') }}</p></div></div><div class="case-text"><article><span>01 / THE CHALLENGE</span><h3>A problem worth solving.</h3><p>{{ selected.challenge }}</p></article><article><span>02 / THE APPROACH</span><h3>Considered from the start.</h3><p>{{ selected.approach }}</p></article><article><span>03 / THE OUTCOME</span><h3>The details, together.</h3><p>{{ selected.outcome }}</p><ul><li v-for="highlight in selected.highlights" :key="highlight"><Icon name="check" :size="17" /> {{ highlight }}</li></ul></article></div><div class="case-links"><a v-if="safeUrl(selected.liveUrl)" :href="safeUrl(selected.liveUrl)" target="_blank" rel="noopener noreferrer" class="button button-dark">Visit live project <Icon name="arrow" :size="17" /></a><a v-if="safeUrl(selected.sourceUrl)" :href="safeUrl(selected.sourceUrl)" target="_blank" rel="noopener noreferrer" class="text-link">View source <Icon name="github" :size="18" /></a><button class="text-link case-back" @click="closeProject">Back to selected work <Icon name="right" :size="17" /></button></div></div>
    </dialog>
  </div>
</template>
