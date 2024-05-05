import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TopView from "../views/TopView.vue";
import PutPinView from "../views/PutPinView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "top",
    component: TopView,
  },
  {
    path: "/put",
    name: "put",
    component: PutPinView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
