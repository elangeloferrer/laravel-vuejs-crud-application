import { IUser } from "../models/IUser";
import { IProduct } from "../models/IProduct";

export interface GlobalState {
  users: IUser[];
  user: IUser;
  products: IProduct[];
  product: IProduct;

  pagination: {
    current_page: 1;
    next_page_url: "";
    prev_page_url: "";
    per_page: 10;
    total_items: 0;
    total_pages: 0;
  };
  productPageFilters: [];
}
