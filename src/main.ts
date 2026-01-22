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
  pauseOnTabChange: false,
  pauseOnHover: false,
  notifications: {
    success: {
      duration: 2000,
    },
    error: {
      duration: 5000,
    },
    info: {
      duration: 3000,
    },
  },
}))
app.use(router)

app.mount('#app')
