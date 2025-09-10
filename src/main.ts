import { createNotivue } from 'notivue'
import { createApp } from 'vue'
import App from './App.vue'

import router from './routes/index.ts'

import './style.css'
import 'notivue/notifications.css'
import 'notivue/animations.css'
import 'notivue/notification-progress.css'

const app = createApp(App)
app.use(createNotivue({
  limit: 2,
  position: 'bottom-right',
  avoidDuplicates: true,

  notifications: {
    global: {
      duration: 3000,
    },
  },
}))
app.use(router)

app.mount('#app')
