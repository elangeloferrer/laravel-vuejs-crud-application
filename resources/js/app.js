import "./bootstrap";

import { createApp } from "vue";
import { Icon } from "@iconify/vue";

import App from "../components/App.vue";

import router from "../ts/router";
import store from "../ts/store";

const app = createApp(App).component("Icon", Icon);
app.use(router);
app.use(store);
app.mount("#app");
