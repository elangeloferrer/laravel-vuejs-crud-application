import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../../views/DashboardView.vue";
import ProductsOverview from "../../views/products/ProductsOverview.vue";
import CreateProductView from "../../views/products/CreateProductView.vue";
import ProductDetailsView from "../../views/products/ProductDetailsView.vue";
import EditProductView from "../../views/products/EditProductView.vue";
import VideosLinkOverview from "../../views/videos-link/VideosLinkOverview.vue";

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
      {
        path: "/products/create",
        name: "create-product",
        component: CreateProductView,
      },
      {
        path: "/products/view/:productId",
        name: "view-product",
        component: ProductDetailsView,
        props: true,
      },
      {
        path: "/products/edit/:productId",
        name: "edit-product",
        component: EditProductView,
        props: true,
      },
      {
        path: "/videos-link",
        name: "videos-link",
        component: VideosLinkOverview,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("logged");

  if (!isLoggedIn && to.name !== "dashboard") {
    console.log("here");
    next("/");
  } else if (to.path === "/" && isLoggedIn) {
    console.log("there");
    next("/products");
  } else {
    next();
  }
});

export default router;
