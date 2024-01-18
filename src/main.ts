import { createApp } from "vue"
import "./style.css"
import "primevue/resources/themes/lara-light-blue/theme.css"
import App from "./App.vue"
import PrimeVue from "primevue/config"
import DialogService from "primevue/dialogservice"

createApp(App).use(PrimeVue, { ripple: true }).use(DialogService).mount("#app")
