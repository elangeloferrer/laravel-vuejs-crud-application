import { IProduct } from "../models/IProduct";
import api from "./api";

const URLS = {
  products: "products/",
  delete_product_image: "products/product-image/",
};

export const loadProducts = async (payload) => {
  const { response, error } = await api.get(URLS.products, {
    params: {
      keywords: payload.keywords,
      category: payload.category,
      page: payload.page,
      per_page: payload.per_page,
    },
  });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
  }

  return response.data;
};

export const loadProduct = async (id: string) => {
  const { response, error } = await api.get(URLS.products + id, {});

  if (error) {
    console.error("Error view product:", error);
    throw error;
  }

  return response.data;
};

export const addProduct = async (newProductRecord: Partial<IProduct>) => {
  const formData = new FormData();

  console.time("formData append");
  formData.append("name", newProductRecord.name ?? "");
  formData.append("category", newProductRecord.category ?? "");
  formData.append("description", newProductRecord.description ?? "");
  formData.append("datetime", newProductRecord.datetime ?? "");

  // Append each image
  newProductRecord.product_images?.forEach((file: File) => {
    formData.append("product_images[]", file);
  });
  console.timeEnd("formData append");

  console.time("api post");
  const { response, error } = await api.post(URLS.products, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.timeEnd("api post");

  if (error) {
    console.error("Error add new product:", error);
    throw error;
  }

  return response.data;
};

export const editProduct = async (
  id: string,
  editedProduct: Partial<IProduct>,
) => {
  const formData = new FormData();

  formData.append("_method", "PUT");
  formData.append("name", editedProduct.name ?? "");
  formData.append("category", editedProduct.category ?? "");
  formData.append("description", editedProduct.description ?? "");
  formData.append("datetime", editedProduct.datetime ?? "");

  // Append newly added image files
  if (editedProduct.new_images && editedProduct.new_images.length) {
    editedProduct.new_images.forEach((file, index) => {
      formData.append(`new_images[${index}]`, file);
    });
  }

  // Append removed image IDs
  if (
    editedProduct.removed_image_ids &&
    editedProduct.removed_image_ids.length
  ) {
    editedProduct.removed_image_ids.forEach((id, index) => {
      formData.append(`removed_image_ids[${index}]`, id.toString());
    });
  }

  const { response, error } = await api.post(URLS.products + id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (error) {
    console.error("Error update product:", error);
    throw error;
  }

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const { response, error } = await api.delete(URLS.products + id);

  if (error) {
    console.error("Error delete product:", error);
    throw error;
  }

  return response.data;
};

export const deleteProductImage = async (id: string) => {
  const { response, error } = await api.delete(URLS.delete_product_image + id);

  if (error) {
    console.error("Error delete product image:", error);
    throw error;
  }

  return response.data;
};
