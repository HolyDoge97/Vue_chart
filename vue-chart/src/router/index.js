import { createRouter, createWebHistory } from "vue-router";
import commonRoutes from "./commonPages";


const routes = [
  {
    path: "/",
    redirect: "/main",
  },
  ...commonRoutes,
  {
    path: "/:pathMatch(.*)*",
    redirect: "/notFound",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;