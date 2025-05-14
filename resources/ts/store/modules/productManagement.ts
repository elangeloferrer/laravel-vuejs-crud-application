import { Commit } from "vuex";
import { GlobalState } from "../types";
import { loadProducts, loadProduct } from "../../api/products";

const getDefaultState = () => ({
  products: [],
  product: null,
  pagination: {
    current_page: 1,
    next_page_url: "",
    prev_page_url: "",
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  },
  filters: {
    keywords: "",
    category: "",
  },
});

export default {
  namespaced: true,

  state: getDefaultState(),

  mutations: {
    RESET_STATE(state) {
      Object.assign(state, getDefaultState());
    },

    SET_PRODUCTS(state, context: any) {
      state.products = context;
    },

    SET_PRODUCT_TO_VIEW(state, context: any) {
      state.product = context;
    },

    SET_PRODUCT_TO_UPDATE(state, context: any) {
      state.product = context;
    },

    ADD_PRODUCT(state, context: any) {
      console.log("ADD_PRODUCT", state.products, context);
    },

    UPDATE_PRODUCT(state, context: any) {
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

    DELETE_PRODUCT(state, context: string) {
      state.products = state.products.filter((x) => x.id !== context);
    },

    SET_PAGINATION(state, context: any) {
      state.pagination = context;
    },

    SET_CURRENT_PAGE(state, page) {
      state.pagination.current_page = page;
    },

    SET_KEYWORDS(state, keywords) {
      state.filters.keywords = keywords;
    },

    SET_CATEGORY(state, category) {
      state.filters.category = category;
    },
  },

  actions: {
    async resetSate({ commit }) {
      commit("RESET_STATE");
    },

    async setProducts({ commit, state }) {
      let payload = {
        keywords: state.filters.keywords,
        category: state.filters.category,
        page: state.pagination.current_page,
        per_page: state.pagination.per_page,
      };

      let response: any = await loadProducts(payload);

      commit("SET_PRODUCTS", response.data.data);
      commit("SET_PAGINATION", response.data.pagination);
    },

    setKeywords({ commit, dispatch }, keyword) {
      commit("SET_KEYWORDS", keyword);
      commit("SET_CURRENT_PAGE", 1);
      dispatch("setProducts");
    },

    setCategory({ commit, dispatch }, category) {
      commit("SET_CATEGORY", category);
      commit("SET_CURRENT_PAGE", 1);
      dispatch("setProducts");
    },

    changePage({ commit, dispatch }, page) {
      commit("SET_CURRENT_PAGE", page);
      dispatch("setProducts");
    },

    async addProduct({ commit }, payload: any) {
      commit("ADD_PRODUCT", payload);
    },

    async setProductToView({ commit }, payload: any) {
      if (Object.keys(payload.productToView).length === 1) {
        let response: any = await loadProduct(payload.productToView.id);
        commit("SET_PRODUCT_TO_VIEW", response.data);
      } else {
        commit("SET_PRODUCT_TO_VIEW", payload.productToView);
      }
    },

    async setProductToUpdate({ commit }, payload: any) {
      if (Object.keys(payload.productToUpdate).length === 1) {
        let response: any = await loadProduct(payload.productToUpdate.id);
        commit("SET_PRODUCT_TO_UPDATE", response.data);
      } else {
        commit("SET_PRODUCT_TO_UPDATE", payload.productToUpdate);
      }
    },

    async updateProduct({ commit }, payload: any) {
      commit("UPDATE_PRODUCT", payload);
    },

    async deleteProduct({ commit }, payload: any) {
      commit("DELETE_PRODUCT", payload);
    },
  },

  getters: {
    getProducts(state) {
      return state.products;
    },

    getProductToView(state) {
      return state.product;
    },

    getProductToUpdate(state) {
      return state.product;
    },

    getPagination(state) {
      return state.pagination;
    },

    getFilters(state) {
      return state.filters;
    },
  },
};
