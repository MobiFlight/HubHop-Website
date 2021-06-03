import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import SmartTable from "../node_modules/vuejs-smart-table";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import VueFinalModal from "vue-final-modal";

createApp(App)
  .use(router)
  .use(SmartTable)
  .use(VueSweetalert2)
  .use(VueFinalModal)
  .mount("#app");
