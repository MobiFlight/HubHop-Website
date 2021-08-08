<template>
  <button v-if="!account" class="px-5 flex items-center" @click="login">
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
  <button
    v-if="account"
    class="px-5 flex items-center"
    type="button"
    v-on:click="toggleDropdown()"
    ref="btnDropdownRef"
  >
    Hi, {{ account.name }}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ml-1 h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <div
    v-bind:class="{
      hidden: !dropdownPopoverShow,
      block: dropdownPopoverShow,
    }"
    class="bg-hhCard text-base z-50 float-left list-none text-left rounded shadow-lg animate-fade-in-down animate-fade-out-down"
    style="min-width:12rem"
    ref="popoverDropdownRef"
  >
    <router-link
      v-if="account"
      to="/account"
      @click="scrollTop(), toggleDropdown()"
      class="px-4 py-2 flex items-center w-full"
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
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Your Account
    </router-link>
    <div
      class="h-0 border border-solid border-t-0 border-blueGray-800 opacity-25"
    ></div>
    <button
      v-if="account"
      class="px-4 my-2 flex items-center w-full"
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
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import { PublicClientApplication } from "@azure/msal-browser";
import { mapMutations } from "vuex";

export default {
  name: "dropdown",
  data() {
    return {
      account: undefined,
      dropdownPopoverShow: false,

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
    toggleDropdown: function() {
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
          placement: "bottom-start",
        });
      }
    },

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
