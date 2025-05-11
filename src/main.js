import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from "./router";

import 'primeicons/primeicons.css'
import './style.css'


import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';


createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        // darkModeSelector: 'dark',
        cssLayer: false
      }
    }
  })
  .use(ConfirmationService)
  .mount('#app')
