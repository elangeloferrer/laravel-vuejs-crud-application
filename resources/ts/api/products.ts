import { rejects } from "assert";
import { IProduct } from "../models/IProduct";
import api from "./api";

import { AxiosResponse, AxiosError } from "axios";

const URLS = {
  products: "products/",
  delete_product_image: "products/product-image/",
};

export const loadProducts = (payload) => {
  return new Promise((resolve, reject) => {
    api
      .get(URLS.products, {
        params: {
          keywords: payload.keywords,
          category: payload.category,
          page: payload.page,
          per_page: payload.per_page,
        },
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.error("error on load products", error);
      });
  });
};

export const loadProduct = (id: string) => {
  return new Promise((resolve, reject) => {
    api
      .get(URLS.products + id, {})
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.error("error on load products", error);
      });
  });
};

// export const addProduct = (newProductRecord: Partial<IProduct>) => {
//   return new Promise((resolve, reject) => {
//     api
//       .post(URLS.products, {
//         name: newProductRecord.name,
//         category: newProductRecord.category,
//         description: newProductRecord.description,
//         datetime: newProductRecord.datetime,
//         product_images: newProductRecord.product_images,
//       })
//       .then((response: AxiosResponse) => {
//         if (response.status === 201) {
//           resolve(response.data.data);
//         } else {
//           reject();
//         }
//       })
//       .catch((error: AxiosError) => {
//         console.log("error in add new product ===> ", error);
//       });
//   });
// };

export const addProduct = (newProductRecord: Partial<IProduct>) => {
  return new Promise((resolve, reject) => {
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
    api
      .post(URLS.products, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
          resolve(response.data.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.error("Error in add new product ===>", error);
        reject(error);
      });
    console.timeEnd("api post");
  });
};

// export const editProduct = (id: string, editedProduct: Partial<IProduct>) => {
//   return new Promise((resolve, reject) => {
//     api
//       .put(URLS.products + id + "/", {
//         name: editedProduct.name,
//         category: editedProduct.category,
//         description: editedProduct.description,
//         datetime: editedProduct.datetime,
//         product_images: editedProduct.product_images,
//       })
//       .then((response: AxiosResponse) => {
//         if (response.status === 200) {
//           resolve(response.data.data);
//         } else {
//           reject();
//         }
//       })
//       .catch((error: AxiosError) => {
//         console.log("error in update product ===> ", error);
//       });
//   });
// };

export const editProduct = (id: string, editedProduct: Partial<IProduct>) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    console.log("editedProduct", editedProduct);
    console.log("editedProduct", editedProduct);
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

    api
      .post(URLS.products + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("error in update product ===> ", error);
        reject(error);
      });
  });
};

export const deleteProduct = (id: string) => {
  return new Promise((resolve, reject) => {
    api
      .delete(URLS.products + id)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("error in delete product ===> ", error);
      });
  });
};

export const deleteProductImage = (id: string) => {
  return new Promise((resolve, reject) => {
    api
      .delete(URLS.delete_product_image + id)
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject();
        }
      })
      .catch((error: AxiosError) => {
        console.log("error in delete product image ===> ", error);
      });
  });
};
