import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../../views/DashboardView.vue";
import ProductsOverview from "../../views/products/ProductsOverview.vue";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,

    children: [
      {
        path: "/products",
        name: "products",
        component: ProductsOverview,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
