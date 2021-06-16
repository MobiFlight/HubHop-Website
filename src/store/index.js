import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: "3fa991e7-f622-4b85-bdcf-d08af4083f79",
          authority:
            "https://mobiflightid.b2clogin.com/mobiflightid.onmicrosoft.com/B2C_1_mobiflight",
          knownAuthorities: ["mobiflightid.b2clogin.com"],
          redirectUri: "https://hubhop.io:8080/callback",
        },
        cache: {
          cacheLocation: "localStorage",
        },
      },
      accessToken: "",
    };
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  plugins: [createPersistedState()],
});

export default store;
