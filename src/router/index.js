import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Team from "../views/Team.vue";
import Api from "../views/Api.vue";
import List from "../views/List.vue";
import Add from "../views/Add.vue";
import Terms from "../views/Terms.vue";
import Privacy from "../views/Privacy.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/team",
    name: "Team",
    component: Team,
  },
  {
    path: "/api",
    name: "API",
    component: Api,
  },
  {
    path: "/list",
    name: "List",
    component: List,
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
  },
  {
    path: "/terms",
    name: "Terms",
    component: Terms,
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: Privacy,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
