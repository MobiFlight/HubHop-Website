import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import SmartTable from "../node_modules/vuejs-smart-table";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueFinalModal from "vue-final-modal";
import authConfig from "../auth_config.json";
import { setupAuth } from "../auth";

let app = createApp(App)
.use(router)
.use(SmartTable)
.use(VueSweetalert2)
.use(VueFinalModal)
// .mount("#app");

// createApp(App)
//   .use(router)
//   .use(SmartTable)
//   .use(VueSweetalert2)
//   .use(VueFinalModal)
//   // .mount("#app");

function callbackRedirect(appState) {
  router.push(appState && appState.targetUrl ? appState.targetUrl : "/");
}

setupAuth(authConfig, callbackRedirect).then((auth) => {
  app.use(auth).mount("#app");
});
