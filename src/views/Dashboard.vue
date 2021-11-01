<template>
  <div
    class="container mb-5 px-5 mx-auto xl:flex xl:space-x-5 min-h-screen -mt-10 xl:mt-5"
  >
    <Head>
      <title>Hubhop Dashboard</title>
      <meta property="og:title" content="Hubhop Dashboard" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hubhop.mobiflight.com/#/dashboard" />
      <meta property="og:image" content="../src/assets/logo.png" />
      <meta
        property="og:description"
        content="Dashboard of all presets, documented by the community for the community."
      />
      <meta name="theme-color" content="#FFA047" />
    </Head>
    <div
      class="bg-hhCard flex flex-col xl:block justify-center rounded-lg shadow-lg py-5 mb-5 xl:mb-0 w-full xl:w-1/6 text-xs xl:text-base "
    >
      <h3 class="border-b border-hhText pb-3 mx-3">Menu</h3>
      <div class="flex justify-center mt-3 mb-3 px-3">
        <button
          @click="dashboardActive()"
          class="flex justify-start xl:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
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
      <div class="flex justify-start mb-3 px-3">
        <button
          @click="reportedActive()"
          class="flex justify-start xl:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon mr-1 icon-tabler icon-tabler-message-report"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"
            ></path>
            <line x1="12" y1="8" x2="12" y2="11"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line>
          </svg>
          Reported presets
        </button>
      </div>
      <div class="flex justify-start px-3">
        <button
          @click="changelogActive()"
          class="flex justify-start xl:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
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
      <!-- General Dashboard -->
      <transition name="fade" mode="out-in">
        <GeneralDashboard class="-mt-2" v-if="dashboard" />
      </transition>

      <!-- Reported events -->
      <transition name="fade" mode="out-in">
        <ReportedPresets class="-mt-2" v-if="reported" />
      </transition>

      <!-- Hubhop Issues -->
      <transition name="fade" mode="out-in">
        <Issues class="-mt-2" v-if="changelog" />
      </transition>
    </div>
  </div>
</template>

<script>
import GeneralDashboard from "../components/GeneralDashboard.vue";
import ReportedPresets from "../components/ReportedPresets.vue";
import Issues from "../components/Issues.vue";
import { Head } from "@vueuse/head";

export default {
  name: "dashboard",
  components: { GeneralDashboard, ReportedPresets, Issues, Head },
  data() {
    return {
      dashboard: true,
      reported: false,
      changelog: false,
    };
  },
  methods: {
    dashboardActive() {
      if (this.reported || this.changelog) {
        setTimeout(() => {
          this.dashboard = true;
        }, 500);
        this.reported = false;
        this.changelog = false;
      }
    },
    reportedActive() {
      if (this.dashboard || this.changelog) {
        setTimeout(() => {
          this.reported = true;
        }, 500);
        this.dashboard = false;
        this.changelog = false;
      }
    },
    changelogActive() {
      if (this.dashboard || this.reported) {
        setTimeout(() => {
          this.changelog = true;
        }, 500);
        this.dashboard = false;
        this.reported = false;
      }
    },
  },
};
</script>
