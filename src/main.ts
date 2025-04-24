import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import './style.css'
import environment from './environment/environment';
import axios from 'axios';

// Create the app
const app = createApp(App);
const baseUrl = environment.apiUrl;

const axiosIns = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Ensure credentials are sent with requests
});

// Create the query client
const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

// Install plugins
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(router); // Add this line to install the router

// Mount the app
app.mount('#app');

export default axiosIns;