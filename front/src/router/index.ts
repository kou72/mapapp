import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TopView from "../views/TopView.vue";
import PostPinView from "../views/PostPinView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "top",
    component: TopView,
  },
  {
    path: "/about",
    name: "about",
    component: PostPinView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
