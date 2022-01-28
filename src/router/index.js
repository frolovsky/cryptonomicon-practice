import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./../views/Home.vue"),
  },
  {
    path: "/empty",
    name: "Empty",
    component: () => import("./../views/Empty.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
