import { createNotivue } from 'notivue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './routes/index.ts'

import './style.css'
import 'notivue/notifications.css'
import 'notivue/animations.css'

const pinia = createPinia()

const app = createApp(App)
app.use(createNotivue())
app.use(pinia)
app.use(router)

app.mount('#app')
