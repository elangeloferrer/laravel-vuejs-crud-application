import { IUser } from "../models/IUser";
import { IProduct } from "../models/IProduct";

export interface GlobalState {
  users: IUser[];
  user: IUser;
  products: IProduct[];
  product: IProduct;

  pagination: [];
  productPageFilters: [];
}
