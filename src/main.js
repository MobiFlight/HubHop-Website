import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import SmartTable from '../node_modules/vuejs-smart-table'

createApp(App)
  .use(router)
  .use(SmartTable)
  .mount("#app");


  