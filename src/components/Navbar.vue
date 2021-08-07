<template>
  <div
    :class="{ onScroll: !view.topOfPage }"
    class="nav fixed top-0 left-0 right-0"
  >
    <div class="px-52 mx-auto px-page">
      <div class="flex justify-between">
        <div>
          <router-link @click="scrollTop" to="/"
            ><img class="max-h-20" src="@/assets/logo-big.png" alt=""
          /></router-link>
        </div>
        <div class="flex items-center text-2xl">
          <router-link @click="scrollTop" class="px-5 flex items-center" to="/"
            ><svg
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              /></svg
            >Home</router-link
          >
          <!-- <router-link @click="scrollTop" class="px-5" to="/add"
            >Add event</router-link
          > -->
          <router-link
            @click="scrollTop"
            class="px-5 flex items-center"
            to="/list"
            ><svg
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              /></svg
            >Preset list</router-link
          >
          <!-- <router-link @click="scrollTop" class="px-5" to="/api"
            >The API</router-link
          >
          <router-link @click="scrollTop" class="px-5" to="/team"
            >The Team</router-link
          > -->
          <div class="flex items-center text-2xl">
            <button
              v-if="!account"
              class="px-5 flex items-center"
              @click="login"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Log in
            </button>
            <div v-if="account" class="px-5 flex items-center">
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
              >Hi, {{ account.name }}
            </div>
            <button
              v-if="account"
              class="px-5 flex items-center"
              @click="logout"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
            <img class="w-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";
import { mapMutations } from "vuex";

export default {
  name: "Navbar",
  data() {
    return {
      account: undefined,
      view: {
        topOfPage: true,
      },
    };
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
    const myAccounts = this.$msalInstance.getAllAccounts();
    this.account = myAccounts[0];
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapMutations(["setAccessToken", "setUserSettings"]),
    async login() {
      await this.$msalInstance
        .loginPopup({})
        .then(() => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          this.account = myAccounts[0];
          this.$msalInstance;
          this.$store.commit("setLoggedIn", true);
          this.getAccessToken().then(() => this.getUserSettings());
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`);
          this.$store.commit("setUserSettings", {
            roles: ["Guest"],
            username: "Guest",
          });
          this.$store.commit("setLoggedIn", false);
          this.$store.commit("setAccessToken", "");
          this.$msalInstance
            .logout({})
            .then(() => {})
            .catch((error) => {
              console.error(error);
            });
        });
    },
    async getAccessToken() {
      let request = {
        scopes: [process.env.VUE_APP_HUBHOP_OAUTH_SCOPES],
        account: this.account,
      };
      const msalInstance = new PublicClientApplication(
        this.$store.state.msalConfig
      );
      try {
        let tokenResponse = await msalInstance.acquireTokenSilent(request);
        this.$store.commit("setAccessToken", tokenResponse.accessToken);
      } catch (error) {
        console.error(
          `"Silent token acquisition failed. Using interactive mode" + ${error}`
        );
        this.logout();
      }
      return console.log("This Account is: " + this.account);
    },
    async getUserSettings() {
      const url = this.$hubHopApi.baseUrl + "/settings/user";
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      };
      fetch(url, options)
        .then((response) => response.json())
        .then((userSettings) => {
          this.$store.commit("setUserSettings", userSettings);
          console.log(userSettings);
        });
    },
    // Log the user out
    async logout() {
      this.$store.commit("setUserSettings", {
        roles: ["Guest"],
        username: "Guest",
      });
      this.$store.commit("setLoggedIn", false);
      this.$store.commit("setAccessToken", "");
      await this.$msalInstance
        .logout({})
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    },
    handleScroll() {
      if (window.pageYOffset > 0) {
        if (this.view.topOfPage) this.view.topOfPage = false;
      } else {
        if (!this.view.topOfPage) this.view.topOfPage = true;
      }
    },
    scrollTop: function() {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId);
        }
        window.scroll(0, window.pageYOffset - 50);
      }, 20);
    },
    scrollListener: function() {
      this.visible = window.scrollY > 150;
    },
    mounted() {
      const accounts = this.$msalInstance.getAllAccounts();
      if (accounts.length == 0) {
        console.log("here");
        return;
      }
      this.account = accounts[0];
      console.log(this.account);
    },
    beforeUnmount: function() {
      window.removeEventListener("scroll", this.scrollListener);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  transition: all 0.2s ease-in-out;
  &.onScroll {
    box-shadow: 0 0 10px #33353e;
    background-color: #33353e;
  }
  a {
    &.router-link-exact-active {
      color: #ffa047;
    }
  }
}
</style>
