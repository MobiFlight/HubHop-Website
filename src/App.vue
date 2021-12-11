<template>
  <metainfo></metainfo>
  <Navbar />
  <div class="py-16"></div>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { useMeta } from "vue-meta";
import { computed } from "@vue/runtime-core";

export default {
  name: "App",
  data() {
    return {
      title: "Hubhop",
      lastListEdit: "",
    };
  },
  components: { Navbar, Footer },
  methods: {
    getLastPreset() {
      const url = this.$hubHopApi.baseUrl + "/statistics/last";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((lastPreset) => {
          for (let index = 0; index < lastPreset.length; index++) {
            const preset = lastPreset[index];
            this.$store.commit("setLastListEdit", preset.createdDate)
          }
        });
    },
  },
  mounted() {
    this.getLastPreset();
    useMeta(
      computed(() => ({
        title: this.title,
        description:
          "HubHop is an API which consolidates Microsoft Flight Simulator 2020 variables and events and provides unique, understandable and standardized events and variables.",
        meta: [
          {
            vmid: "og:description",
            property: "og:description",
            content:
              "HubHop is an API which consolidates Microsoft Flight Simulator 2020 variables and events and provides unique, understandable and standardized events and variables.",
          },
          { property: "og:type", vmid: "og:type", content: "website" },
          {
            property: "og:url",
            vmid: "og:url",
            content: window.location.href,
          },
          {
            property: "og:image",
            vmid: "og:image",
            content: "../src/assets/logo.png",
          },
          {
            property: "og:title",
            vmid: "og:title",
            content: this.title,
          },
          {
            name: "theme-color",
            vmid: "theme-color",
            content: "#FFA047",
          },
        ],
      }))
    );
    if (
      this.$store.state.refreshCycle == "default" ||
      this.$store.state.refreshCycle == ""
    ) {
      this.$store.commit("setRefreshCycle", "default");
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=KoHo:wght@300&display=swap");
html {
  height: 100%;
  margin: 0;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  color: #d2d0d2;
  background-image: url("./assets/bg-hubhop.png");
}

#app {
  font-family: "KoHo", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: larger;
  h1,
  .h1 {
    font-size: calc(1.375rem + 1.5vw);
  }
  @media (min-width: 1200px) {
    h1,
    .h1 {
      font-size: 2.5rem;
    }
  }

  h2,
  .h2 {
    font-size: calc(1.325rem + 0.9vw);
  }
  @media (min-width: 1200px) {
    h2,
    .h2 {
      font-size: 2rem;
    }
  }

  h3,
  .h3 {
    font-size: calc(1.3rem + 0.6vw);
  }
  @media (min-width: 1200px) {
    h3,
    .h3 {
      font-size: 1.75rem;
    }
  }

  h4,
  .h4 {
    font-size: calc(1.275rem + 0.3vw);
  }
  @media (min-width: 1200px) {
    h4,
    .h4 {
      font-size: 1.5rem;
    }
  }

  h5,
  .h5 {
    font-size: 1.25rem;
  }

  h6,
  .h6 {
    font-size: 1rem;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  .h-full {
    height: 100vh;
  }
}
</style>
