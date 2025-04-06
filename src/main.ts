import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './routes/index.ts'

import { createNotivue } from 'notivue'
import 'notivue/notifications.css'
import 'notivue/animations.css'

const app = createApp(App)
app.use(createNotivue())
app.use(router)

app.mount('#app')
