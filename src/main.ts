import './assets/main.css';
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from '@/router';
import {useAuthStore} from '@/stores/auth';
import axios from 'axios';

const vuetify = createVuetify({
	components,
	directives,
})

const app = createApp(App).use(vuetify)

app.use(createPinia())
app.use(router);
app.use(createVuetify())

const authStore = useAuthStore();
if (authStore.token) {
	axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
}

router.isReady().then(() => {
	app.mount('#app');
});

