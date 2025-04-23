import { Commit } from "vuex";
import { GlobalState } from "../types";
import { loadProducts, loadProduct } from "../../api/products";

// 🆕 Default state factory function
const getDefaultState = (): GlobalState => ({
  users: [],
  user: null,
  products: [],
  product: null,
  pagination: [],
  productPageFilters: [],
});

export default {
  namespaced: true,

  state: getDefaultState(),

  mutations: {
    RESET_STATE(state: GlobalState) {
      Object.assign(state, getDefaultState());
    },

    SET_PRODUCTS(state: GlobalState, context: any) {
      state.products = context;
    },

    SET_PRODUCT_TO_VIEW(state: GlobalState, context: any) {
      state.product = context;
    },

    SET_PRODUCT_TO_UPDATE(state: GlobalState, context: any) {
      state.product = context;
    },

    ADD_PRODUCT(state: GlobalState, context: any) {
      console.log("ADD_PRODUCT", state.products, context);
    },

    UPDATE_PRODUCT(state: GlobalState, context: any) {
      let index = state.products.findIndex((x) => x.id === context.id);

      state.products[index] = {
        ...state.products[index],
        name: context.editedProduct.name,
        category: context.editedProduct.category,
        description: context.editedProduct.description,
        datetime: context.editedProduct.datetime,
        product_images: context.editedProduct.product_images,
      };
    },

    DELETE_PRODUCT(state: GlobalState, context: string) {
      state.products = state.products.filter((x) => x.id !== context);
    },

    SET_PAGINATION(state: GlobalState, context: any) {
      state.pagination = context;
    },

    SET_PRODUCT_PAGE_FILTERS(state: GlobalState, context: any) {
      state.productPageFilters = context;
    },
  },

  actions: {
    async resetSate({ commit }: { commit: Commit }) {
      commit("RESET_STATE");
    },

    async setProductPageFilters({ commit }: { commit: Commit }, payload: any) {
      commit("SET_PRODUCT_PAGE_FILTERS", payload);
    },

    async setProducts({ commit }: { commit: Commit }, payload: any) {
      let data: any = await loadProducts(payload);

      commit("SET_PRODUCTS", data.data);

      let filters = {
        keywords: data.data.keywords || "",
        category: data.data.category || "",
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
      };
      commit("SET_PRODUCT_PAGE_FILTERS", filters);
      commit("SET_PAGINATION", data.pagination);
    },

    async addProduct({ commit }: { commit: Commit }, payload: any) {
      commit("ADD_PRODUCT", payload);
    },

    async setProductToView({ commit }: { commit: Commit }, payload: any) {
      if (Object.keys(payload.productToView).length === 1) {
        let product: any = await loadProduct(payload.productToView.id);
        commit("SET_PRODUCT_TO_VIEW", product);
      } else {
        commit("SET_PRODUCT_TO_VIEW", payload.productToView);
      }
    },

    async setProductToUpdate({ commit }: { commit: Commit }, payload: any) {
      if (Object.keys(payload.productToUpdate).length === 1) {
        let product: any = await loadProduct(payload.productToUpdate.id);
        commit("SET_PRODUCT_TO_UPDATE", product);
      } else {
        commit("SET_PRODUCT_TO_UPDATE", payload.productToUpdate);
      }
    },

    async updateProduct({ commit }: { commit: Commit }, payload: any) {
      commit("UPDATE_PRODUCT", payload);
    },

    async deleteProduct({ commit }: { commit: Commit }, payload: any) {
      commit("DELETE_PRODUCT", payload);
    },
  },

  getters: {
    getProducts(state: GlobalState) {
      return state.products;
    },

    getProductToView(state: GlobalState) {
      return state.product;
    },

    getProductToUpdate(state: GlobalState) {
      return state.product;
    },

    getPagination(state: GlobalState) {
      return state.pagination;
    },

    getProductPageFilters(state: GlobalState) {
      return state.productPageFilters;
    },
  },
};
