import "./bootstrap";

import { createApp } from "vue";
import App from "./components/App.vue";
// import router from "../router";
// import { Icon } from "@iconify/vue";
// import store from "../ts/store";

const app = createApp(App);
// .component("Icon", Icon);
// app.use(router);
// app.use(store);
app.mount("#app");
