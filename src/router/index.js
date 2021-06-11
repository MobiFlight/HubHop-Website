import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Team from "../views/Team.vue";
import Api from "../views/Api.vue";
import List from "../views/List.vue";
import Add from "../views/Add.vue";
import Terms from "../views/Terms.vue";
import Privacy from "../views/Privacy.vue";
import PresetEdit from "../views/PresetEdit.vue";
import PresetView from "../views/PresetView.vue";
import Callback from '../views/Callback'
import ErrorPage from '../views/Error'

// import { routeGuard } from '../../auth'


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
    // beforeEnter: routeGuard,
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
  {
    path: "/presetview/:id",
    name: "PresetView",
    component: PresetView,
    props: true,
  },
  {
    path: "/presetedit/:id",
    name: "PresetEdit",
    component: PresetEdit,
    props: true,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback,
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
