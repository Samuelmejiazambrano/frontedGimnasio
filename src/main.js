import { createApp } from "vue";
import { router } from "./routes/routes.js";
import { createPinia } from "pinia";
import { Quasar, Notify } from "quasar";
import piniaPluginPersistedstate from'pinia-plugin-persistedstate';


// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import App from "./App.vue";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.use(pinia);

app.use(router);
app.use(Quasar, {
    plugins: { Notify },
    config: {
      notify: {
        position: 'top',
       
        timeout: 2500,
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }],
        color:"red"

      },
    },
  });
app.mount("#app");