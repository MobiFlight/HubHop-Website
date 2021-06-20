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
          <router-link @click="scrollTop" class="px-5" to="/">Home</router-link>
          <!-- <router-link @click="scrollTop" class="px-5" to="/add"
            >Add event</router-link
          > -->
          <router-link @click="scrollTop" class="px-5" to="/list"
            >Preset list</router-link
          >
          <!-- <router-link @click="scrollTop" class="px-5" to="/api"
            >The API</router-link
          >
          <router-link @click="scrollTop" class="px-5" to="/team"
            >The Team</router-link
          > -->
          <div class="flex items-center text-2xl">
            <button v-if="!account" class="px-5" @click="login">
              Log in
            </button>
            <div v-if="account" class="px-5">Hi, {{ account.name }}</div>
            <button v-if="account" class="px-5" @click="logout">
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
          this.getAccessToken().then(() => this.getUserSettings());
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`);
        });
    },
    async getAccessToken() {
      let request = {
        scopes: [process.env.VUE_APP_HUBHOP_OAUTH_SCOPES],
      };
      const msalInstance = new PublicClientApplication(
        this.$store.state.msalConfig
      );
      try {
        let tokenResponse = await msalInstance.acquireTokenSilent(request);
        this.$store.commit("setAccessToken", tokenResponse.accessToken);
      } catch (error) {
        console.error(
          "Silent token acquisition failed. Using interactive mode"
        );
        let tokenResponse = await msalInstance.acquireTokenPopup(request);
        console.log(
          `Access token acquired via interactive auth ${tokenResponse.accessToken}`
        );
        this.$store.commit("setAccessToken", tokenResponse.accessToken);
      }
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
