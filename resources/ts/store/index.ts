import { createStore } from "vuex";
import state from "./state";
import { GlobalState } from "./types";

import productManagement from "./modules/productManagement";

const store = createStore<GlobalState>({
  state,
  modules: {
    productManagement: productManagement,
  },
});

export default store;
