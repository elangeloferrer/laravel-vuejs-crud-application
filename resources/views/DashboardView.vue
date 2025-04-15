<template>
  <div class="flex min-h-screen flex-col">
    <!-- Navbar -->
    <nav
      class="flex items-center justify-between border-b border-gray-400 bg-white px-6 py-3 text-black"
    >
      <!-- Left Side -->
      <div class="flex items-center space-x-3">
        <h1 class="font-semibold">Praxxys' Backend Examination</h1>
      </div>
    </nav>

    <div class="flex flex-1">
      <!-- Sidebar -->

      <aside
        :class="[
          'flex h-screen flex-col justify-between border-r border-gray-400 bg-white p-4 shadow-md transition-[width] duration-100',
          isSidebarOpen ? 'w-48' : 'w-16',
        ]"
      >
        <!-- Top Content -->
        <div>
          <div class="mb-4 flex items-center text-black hover:text-blue-400">
            <button @click="toggleSidebar()" class="text-4xl">
              <span v-if="isSidebarOpen">
                <Icon icon="material-symbols:menu-open" />
              </span>
              <span v-else>
                <Icon icon="material-symbols:menu" />
              </span>
            </button>
          </div>
          <div
            v-if="isSidebarOpen"
            class="text-left text-xl font-light text-gray-400"
          >
            <h1>Dashboards</h1>
          </div>
          <ul class="gap-y-4">
            <li
              v-for="(item, index) in menuItems"
              :key="index"
              class="mt-4 mb-4 ml-4"
            >
              <router-link :to="item.path || ''" v-if="isSidebarOpen">
                <a
                  href="#"
                  class="flex items-center space-x-4 text-black hover:text-blue-400"
                >
                  <Icon :icon="item.icon" class="text-xl" />
                  <span>{{ item.name }}</span>
                </a>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Bottom Logout Button -->
        <div class="flex items-center text-black hover:text-blue-400">
          <button class="flex space-x-3">
            <Icon icon="material-symbols:logout" class="text-xl" />
            <span v-if="isSidebarOpen">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 overflow-y-auto bg-gray-100 p-4 shadow-md"
        style="max-height: calc(120vh - 10rem)"
      >
        <router-view :key="route.path"></router-view>
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="border-t border-gray-400 bg-white py-4 text-center text-black"
    >
      <p>&copy; {{ yearNow }} PBE. All rights reserved.</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

import { useMoment } from "../ts/utils/useMoment";

export default defineComponent({
  setup() {
    const route = useRoute();
    const moment = useMoment();

    const yearNow = moment().format("YYYY");

    const isSidebarOpen = ref(false);

    const menuItems = ref([
      {
        name: "Products",
        path: "products",
        icon: "mingcute:cube-line",
        isOpen: false,
        isLink: true,
        children: [],
      },
    ]);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(async () => {});

    onUnmounted(() => {});

    return {
      route,
      menuItems,
      isSidebarOpen,
      yearNow,

      toggleSidebar,
    };
  },
});
</script>
