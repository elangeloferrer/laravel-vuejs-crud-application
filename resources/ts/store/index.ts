import { createStore } from "vuex";
import state from "./state";

import createPersistedState from "vuex-persistedstate";

import { GlobalState } from "./types";

import productManagement from "./modules/productManagement";

const store = createStore<GlobalState>({
  state,
  modules: {
    productManagement: productManagement,
  },
  plugins: [
    createPersistedState({
      paths: ["productManagement"],
    }),
  ],
});

export default store;
