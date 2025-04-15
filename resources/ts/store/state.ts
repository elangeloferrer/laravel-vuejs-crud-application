import { GlobalState } from "./types";

const state = (): GlobalState => {
  return {
    users: [],
    user: null as any,
    products: [],
    product: null as any,

    pagination: [],
  };
};

export default state;
