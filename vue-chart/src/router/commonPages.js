
const commonRoutes = [
  {
    path: "/main",
    name: "UpscaleMain",
    component: () => import("@/views/pages/Home.vue"),
  },
  {
    path: "/notFound",
    name: "notFound",
    component: () => import("@/views/pages/NotFound.vue"),
  }
];
export default commonRoutes;