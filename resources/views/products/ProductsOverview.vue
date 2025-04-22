<template>
  <header class="mb-5 flex items-center justify-between">
    <p>
      <span class="font-regular text-xl text-gray-400"
        >Dashboards&nbsp;&nbsp;/&nbsp;</span
      >
      <span class="font-regular text-xl text-black"> &nbsp;Products </span>
    </p>
  </header>

  <ViewImagesModal
    v-if="isViewImagesModalVisible"
    @close-modal="closeViewImageModal"
    :images_to_view="imagesToView"
  />

  <ConfirmDeleteModal
    v-if="isDeleteModalVisible"
    @close-modal="closeDeleteModal"
    @handle-delete-product="handleDeleteProduct"
    :PRODUCT_NAME="PRODUCT_NAME"
  />

  <div class="flex justify-between pt-4 pb-4">
    <div class="flex flex-wrap items-center space-x-1">
      <input
        v-model="keywords"
        type="text"
        class="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Search..."
        required
        @keyup.enter="searchProduct"
      />

      <select
        v-model="category"
        class="rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      >
        <option value="">Select category</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>

      <div class="items-center">
        <button
          @click.stop
          @click="searchProduct()"
          class="flex items-center gap-1 rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
        >
          Search
          <Icon icon="mdi:search" class="text-xl" />
        </button>
      </div>
    </div>
    <div class="items-center space-x-3">
      <button
        @click.stop
        @click="goToCreateProductPage()"
        class="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Add New
        <Icon icon="mdi:plus" class="text-xl hover:text-blue-400" />
      </button>
    </div>
  </div>
  <table class="min-w-full border border-gray-300 text-black">
    <thead class="bg-thbg-light dark:bg-thbg-dark border-gray-300">
      <tr>
        <th class="p-3 text-left">#</th>
        <th class="p-3 text-left">Name</th>
        <th class="p-3 text-left">Category</th>
        <th class="p-3 text-left">Description</th>
        <th class="p-3 text-left">Images</th>
        <th class="p-3 text-left">Actions</th>
      </tr>
    </thead>
    <tbody class="">
      <tr
        v-for="(item, index) in products"
        :key="index"
        class="border-b border-gray-300"
      >
        <td class="p-3">{{ index + 1 }}</td>
        <td class="p-3">{{ item.name }}</td>
        <td class="p-3">{{ item.category }}</td>
        <td class="p-3">{{ item.description }}</td>
        <td class="p-3">
          <button
            v-if="item.product_images && item.product_images.length > 0"
            @click.stop
            @click="openViewImageModal(item.product_images)"
            href="#"
            class="inline-flex items-center rounded-2xl bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
          >
            View Images
          </button>
        </td>
        <td class="p-3">
          <div class="flex space-x-4 text-center">
            <button>
              <Icon
                @click.stop
                @click="goToProductDetailsPage(item.id)"
                icon="mdi:show"
                class="text-xl text-blue-400 hover:text-blue-500"
              />
            </button>
            <button @click.stop @click="goToEditProductPage(item.id)">
              <Icon
                icon="material-symbols:edit"
                class="text-xl text-yellow-400 hover:text-yellow-500"
              />
            </button>
            <button @click.stop @click="openDeleteModal(item.id, item.name)">
              <Icon
                icon="material-symbols:delete"
                class="text-xl text-red-400 hover:text-red-500"
              />
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="products?.length === 0">
        <td colspan="6" class="text-center">No products found.</td>
      </tr>
    </tbody>
  </table>
  <div class="flex justify-end space-x-1 pt-2 pr-2" v-if="pagination">
    <span class="text-md pt-2 text-gray-600">
      Page {{ pagination.current_page }} of {{ pagination.total_pages }}
    </span>

    <button
      @click="goToPage(currentPage - 1)"
      :disabled="!pagination.prev_page_url"
      class="rounded border border-gray-800 px-2 py-1 text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-400 disabled:text-white"
    >
      <Icon icon="fa:angle-left" />
    </button>

    <button
      v-for="page in pagination.total_pages"
      :key="page"
      @click="goToPage(page)"
      class="rounded border border-gray-800 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-400 disabled:text-white"
      :class="[
        page === pagination.current_page ? 'bg-blue-500 text-white' : '',
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="!pagination.next_page_url"
      class="rounded border border-gray-800 px-2 py-1 text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-400 disabled:text-white"
    >
      <Icon icon="fa:angle-right" />
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  toRaw,
  onUnmounted,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { editProduct } from "../../ts/api/products";
import { deleteProduct } from "../../ts/api/products";

import ViewImagesModal from "./screens/ViewImagesModal.vue";
import ConfirmDeleteModal from "./screens/ConfirmDeleteModal.vue";

export default defineComponent({
  components: {
    ViewImagesModal,
    ConfirmDeleteModal,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const categories = [
      "Electronics",
      "Clothing and Apparel",
      "Home and Kitchen",
      "Health and Beauty",
      "Sports and Outdoors",
    ];

    const keywords = ref("");
    const category = ref("");
    const currentPage = ref(1);
    const perPage = ref(10);

    const productIdToUpdate = ref("");
    const productToUpdate = ref();

    const imagesToView = ref([]);
    const isViewImagesModalVisible = ref(false);

    const isDeleteModalVisible = ref(false);
    const PRODUCT_NAME = ref("");
    const productIdToDelete = ref("");

    const products = computed(
      () => store.getters["productManagement/getProducts"],
    );

    const pagination = computed(
      () => store.getters["productManagement/getPagination"],
    );

    const updateList = async (triggerFrom, productPageFilters?) => {
      let params;

      if (triggerFrom === "fromOtherPage") {
        params = {
          keywords: productPageFilters.keywords || keywords.value,
          category: productPageFilters.category || category.value,
          page: productPageFilters.current_page || currentPage.value,
          per_page: productPageFilters.per_page || perPage.value,
        };
      } else {
        params = {
          keywords: keywords.value,
          category: category.value,
          page: triggerFrom === "searchProduct" ? 1 : currentPage.value,
          per_page: perPage.value,
        };
      }

      console.log("POV trigger from => " + triggerFrom);

      let data: any = await Promise.allSettled([
        store.dispatch("productManagement/setProducts", params),
      ]);
      return data;
    };

    const setProductFiltersFunction = () => {
      let productPageFilters =
        store.getters["productManagement/getProductPageFilters"];
      store.dispatch("productManagement/setProductPageFilters", {
        keywords: productPageFilters?.keywords || "",
        category: productPageFilters?.category || "",
        current_page: productPageFilters?.current_page || 1,
        per_page: productPageFilters?.per_page || 10,
      });
    };

    const searchProduct = async () => {
      updateList("searchProduct");
      setProductFiltersFunction();
    };

    // start: create product function
    const goToCreateProductPage = () => {
      setProductFiltersFunction();

      router.push({
        name: "create-product",
      });
    };
    // end: create product function

    // start: view product function
    const goToProductDetailsPage = (id: string) => {
      let productToView = toRaw(products.value).find((x: any) => x.id === id);

      store.dispatch("productManagement/setProductToView", {
        productToView: productToView,
      });

      setProductFiltersFunction();

      router.push({
        name: "view-product",
        params: { productId: id },
      });
    };
    // end: view product function

    // start: edit product function
    const goToEditProductPage = (id: string) => {
      productIdToUpdate.value = id;
      productToUpdate.value = toRaw(products.value).find(
        (x: any) => x.id === id,
      );

      store.dispatch("productManagement/setProductToUpdate", {
        productToUpdate: productToUpdate.value,
      });

      setProductFiltersFunction();

      router.push({
        name: "edit-product",
        params: { productId: productIdToUpdate.value },
      });
    };

    const handleUpdateProduct = (editedProduct: any) => {
      let id = productIdToUpdate.value;

      // calls Edit Product API
      editProduct(productIdToUpdate.value, editedProduct).then(() => {
        // updateList();
        // getProducts()
        productIdToUpdate.value = "";
        productToUpdate.value = ref();
        store.dispatch("productManagement/updateProduct", {
          editedProduct,
          id,
        });
      });
    };
    // end: edit product function

    // start: Delete Functions
    const openDeleteModal = (id: string, name: string) => {
      productIdToDelete.value = id;
      PRODUCT_NAME.value = name;
      isDeleteModalVisible.value = true;

      setProductFiltersFunction();
    };

    const closeDeleteModal = () => {
      isDeleteModalVisible.value = false;
    };

    const handleDeleteProduct = () => {
      deleteProduct(productIdToDelete.value)
        .then(() => {
          let id = productIdToDelete.value;
          // store.dispatch("productManagement/deleteProduct", id);
          productIdToDelete.value = "";

          closeDeleteModal();
          updateList("handleDeleteProduct");
        })
        .catch((error) => {
          console.log("error in deleting product", error);
        });
    };
    // end: Delete Functions

    // start: View Images Function
    const openViewImageModal = (images: []) => {
      imagesToView.value = images;
      isViewImagesModalVisible.value = true;
    };

    const closeViewImageModal = () => {
      imagesToView.value = [];
      isViewImagesModalVisible.value = false;
    };
    // end: View Images Function

    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.total_pages) {
        currentPage.value = page;
      }

      updateList("goToPage");
    };

    onMounted(async () => {
      let productPageFilters =
        store.getters["productManagement/getProductPageFilters"];
      if (productPageFilters) {
        setProductFiltersFunction();
        updateList("fromOtherPage", productPageFilters);
      } else {
        updateList("onMount");
      }
    });

    onUnmounted(() => {});

    return {
      PRODUCT_NAME,

      categories,
      keywords,
      category,
      pagination,
      perPage,
      currentPage,

      products,

      productToUpdate,

      isDeleteModalVisible,

      imagesToView,
      isViewImagesModalVisible,

      searchProduct,
      goToCreateProductPage,
      goToProductDetailsPage,
      goToEditProductPage,
      handleUpdateProduct,
      openDeleteModal,
      closeDeleteModal,
      openViewImageModal,
      closeViewImageModal,
      handleDeleteProduct,
      goToPage,
    };
  },
});
</script>
