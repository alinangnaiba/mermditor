// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Import Styles
import '@/styles/tailwind.css'
import '@/styles/global.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
