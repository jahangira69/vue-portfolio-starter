<script setup lang="ts">
import site from './content/site.json'
import Portfolio from './components/Portfolio.vue'
const config = useRuntimeConfig()
const title = `${site.name} — Software Engineer`
const description = `${site.name}, independent software engineer based in the United States. Explore projects, case studies, technical skills, and professional experience.`
useSeoMeta({ title, description, ogTitle: title, ogDescription: description, ogType: 'website', twitterCard: 'summary' })
useHead({
  link: config.public.siteUrl ? [{ rel: 'canonical', href: config.public.siteUrl }] : [],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: { '@type': 'Person', name: site.name, jobTitle: site.role, description, homeLocation: { '@type': 'Country', name: site.location } } }).replace(/</g, '\\u003c') }]
})
</script>
<template><Portfolio /></template>
