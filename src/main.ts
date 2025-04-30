import { createNotivue } from 'notivue'
import { createApp } from 'vue'
import { VueQrcodeReader } from 'vue-qrcode-reader'
import App from './App.vue'

import router from './routes/index.ts'

import './style.css'
import 'notivue/notifications.css'
import 'notivue/animations.css'

const app = createApp(App)
app.use(createNotivue())
app.use(VueQrcodeReader)
app.use(router)

app.mount('#app')
