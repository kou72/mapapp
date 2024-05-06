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
    path: "/insert/:id",
    name: "insert",
    component: PutPinView,
    props: true,
  },
  {
    path: "/modify/:id:name:group:color:lat:lng",
    name: "modify",
    component: PutPinView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
