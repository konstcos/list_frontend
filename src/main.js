import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from "./router";

// import Button from 'primevue/button';

// Icons
// import "@mdi/font/css/materialdesignicons.css";
// import "@fortawesome/fontawesome-free/css/all.css";
// import 'vuetify/styles'
// import {aliases, fa} from 'vuetify/iconsets/fa';
// import {mdi} from 'vuetify/iconsets/mdi';
// import {library} from '@fortawesome/fontawesome-svg-core'
// import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
// import {fas} from '@fortawesome/free-solid-svg-icons'
// import {far} from '@fortawesome/free-regular-svg-icons'

import 'primeicons/primeicons.css'
import './style.css'

// Vuetify

// import {createVuetify} from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
// import Material from '@primeuix/themes/material';
// import Lara from '@primeuix/themes/lara';

// const vuetify = createVuetify({
//   theme: {
//     defaultTheme: 'dark',
//   },
//   icons: {
//     defaultSet: 'fa',
//     aliases,
//     sets: {
//       fa,
//       mdi,
//     },
//   },
//   components,
//   directives,
// })

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
  // .use(vuetify)
  .mount('#app')
