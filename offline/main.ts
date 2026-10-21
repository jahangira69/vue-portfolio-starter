import { createApp } from 'vue'
import Portfolio from '../components/Portfolio.vue'
import '../assets/css/main.css'
createApp(Portfolio, { offline: true }).mount('#app')
