<template>
  <div
    class="container mb-5 px-5 mx-auto xl:flex xl:space-x-5 min-h-screen -mt-10 xl:mt-5"
  >
    <div
      class="bg-hhCard flex flex-col xl:block justify-center rounded-lg shadow-lg py-5 mb-5 xl:mb-0 w-full xl:w-1/6 text-xs xl:text-base "
    >
      <h3 class="border-b border-hhText pb-3 mx-3">Menu</h3>
      <div class="flex justify-center mt-3 mb-3 px-3">
        <button
          @click="dashboardActive()"
          class="flex justify-center xl:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-1 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          Dashboard
        </button>
      </div>
      <div class="flex justify-center px-3">
        <button
          @click="changelogActive()"
          class="flex justify-center xl:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-1 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          HubHop Issues
        </button>
      </div>
    </div>
    <div class="mx-auto w-full xl:px-0 xl:w-5/6">
      <!-- Added presets -->
      <transition name="fade" mode="out-in">
        <GeneralDashboard v-if="dashboard" />
      </transition>

      <!-- Updated events -->
      <transition name="fade" mode="out-in">
        <UpdatedPresets v-if="updatedPresets" />
      </transition>

      <!-- Hubhop Issues -->
      <transition name="fade" mode="out-in">
        <Issues v-if="changelog" />
      </transition>
    </div>
  </div>
</template>

<script>
import GeneralDashboard from "../components/GeneralDashboard.vue";
import UpdatedPresets from "../components/UpdatedPresets.vue";
import Issues from "../components/Issues.vue";

export default {
  name: "dashboard",
  components: { GeneralDashboard, UpdatedPresets, Issues },
  data() {
    return {
      dashboard: true,
      updatedPresets: false,
      changelog: false,
    };
  },
  methods: {
    dashboardActive() {
      if (this.updatedPresets || this.changelog) {
        setTimeout(() => {
          this.dashboard = true;
        }, 500);
        this.updatedPresets = false;
        this.changelog = false;
      }
    },
    updatedActive() {
      if (this.dashboard || this.changelog) {
        setTimeout(() => {
          this.updatedPresets = true;
        }, 500);
        this.dashboard = false;
        this.changelog = false;
      }
    },
    changelogActive() {
      if (this.dashboard || this.updatedPresets) {
        setTimeout(() => {
          this.changelog = true;
        }, 500);
        this.dashboard = false;
        this.updatedPresets = false;
      }
    },
  },
};
</script>
