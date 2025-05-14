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

  <div class="overflow-y-auto">
    <div class="mb-4 flex flex-wrap items-center gap-2">
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRaw,
  onUnmounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { save as saveToStore } from "../../ts/local-storage";

import { deleteProduct } from "../../ts/api/products";

import ViewImagesModal from "./screens/ViewImagesModal.vue";
import ConfirmDeleteModal from "./screens/ConfirmDeleteModal.vue";

import { useProducts } from "../../ts/composables/useProducts";

export default defineComponent({
  components: {
    ViewImagesModal,
    ConfirmDeleteModal,
  },

  setup() {
    const router = useRouter();

    const {
      getProducts,
      pagination,
      filters,

      setKeywords,
      setCategory,
      fetchProducts,
      changePage,
      setProductToView,
      setProductToUpdate,

      triggerSuccessNotification,
    } = useProducts();

    const categories = [
      "Electronics",
      "Clothing and Apparel",
      "Home and Kitchen",
      "Health and Beauty",
      "Sports and Outdoors",
    ];

    const products = getProducts;

    const keywords = ref(filters.value?.keywords || "");
    const category = ref(filters.value?.category || "");

    const currentPage = ref(pagination.value?.current_page || 1);
    const perPage = ref(pagination.value?.per_page || 10);

    const productIdToUpdate = ref("");
    const productToUpdate = ref();

    const imagesToView = ref([]);
    const isViewImagesModalVisible = ref(false);

    const isDeleteModalVisible = ref(false);
    const PRODUCT_NAME = ref("");
    const productIdToDelete = ref("");

    const updateList = async () => {
      fetchProducts();
    };

    const searchProduct = async () => {
      updateList();
    };

    // start: create product function
    const goToCreateProductPage = () => {
      router.push({
        name: "create-product",
      });
    };
    // end: create product function

    // start: view product function
    const goToProductDetailsPage = (id: string) => {
      let productToView = toRaw(products.value).find((x: any) => x.id === id);

      setProductToView({
        productToView: productToView,
      });

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

      setProductToUpdate({
        productToUpdate: productToUpdate.value,
      });

      router.push({
        name: "edit-product",
        params: { productId: productIdToUpdate.value },
      });
    };
    // end: edit product function

    // start: Delete Functions
    const openDeleteModal = (id: string, name: string) => {
      productIdToDelete.value = id;
      PRODUCT_NAME.value = name;
      isDeleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalVisible.value = false;
    };

    const handleDeleteProduct = () => {
      deleteProduct(productIdToDelete.value)
        .then((response: any) => {
          productIdToDelete.value = "";

          saveToStore("latest_notif", {
            type: "delete_product_notif",
            is_triggered: false,
            message: response.message,
          });
          triggerSuccessNotification();
          closeDeleteModal();
          updateList();
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
      // if (page >= 1 && page <= pagination.value.total_pages) {
      //   currentPage.value = page;
      // }

      changePage(page);
    };

    onMounted(async () => {
      updateList();

      triggerSuccessNotification();
    });

    onUnmounted(() => {});

    watch(
      () => keywords,
      () => {
        setKeywords(keywords.value);
      },
      { deep: true },
    );

    watch(
      () => category,
      () => {
        setCategory(category.value);
      },
      { deep: true },
    );

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
