import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";

import {
  get as getFromStore,
  load as loadFromStore,
  remove as removeFromStore,
} from "../local-storage";
import { showSuccessToast } from "../utils/toast";

export const useProducts = () => {
  const store = useStore();

  const getProducts = computed(
    () => store.getters["productManagement/getProducts"],
  );

  const pagination = computed(
    () => store.getters["productManagement/getPagination"],
  );

  const filters = computed(() => store.getters["productManagement/getFilters"]);

  const setKeywords = (keywords) =>
    store.dispatch("productManagement/setKeywords", keywords);

  const setCategory = (category) =>
    store.dispatch("productManagement/setCategory", category);

  const changePage = (page) =>
    store.dispatch("productManagement/changePage", page);

  const fetchProducts = () => store.dispatch("productManagement/setProducts");

  const setProductToView = (payload: any) =>
    store.dispatch("productManagement/setProductToView", payload);

  const setProductToUpdate = (payload: any) =>
    store.dispatch("productManagement/setProductToUpdate", payload);

  const isNotificationTriggered = () =>
    computed(() => getFromStore("latest_notif"));

  const triggerSuccessNotification = () => {
    const latestNotif = isNotificationTriggered().value;

    console.log("NAPUNTA BA DITO", latestNotif);
    if (
      latestNotif?.is_triggered !== undefined &&
      latestNotif.is_triggered == false
    ) {
      let defaultMessage = "";
      defaultMessage = latestNotif.type === "login_notif" && "Success login!";
      defaultMessage =
        latestNotif.type === "add_product_notif" && "Product has been created.";
      defaultMessage =
        latestNotif.type === "update_product_notif" &&
        "Product has been updated.";
      defaultMessage =
        latestNotif.type === "delete_product_notif" &&
        "Product has been deleted.";

      showSuccessToast(latestNotif.message || defaultMessage);
      removeFromStore("latest_notif");
    }
  };

  onMounted(async () => {
    loadFromStore("latest_notif");
  });

  return {
    getProducts,
    pagination,
    filters,

    setKeywords,
    setCategory,
    fetchProducts,
    changePage,
    setProductToView,
    setProductToUpdate,

    triggerSuccessNotification,
  };
};
