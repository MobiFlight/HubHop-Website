import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: process.env.VUE_APP_HUBHOP_OAUTH_CLIENTID,
          authority: process.env.VUE_APP_HUBHOP_OAUTH_AUTHORITY,
          knownAuthorities: [ process.env.VUE_APP_HUBHOP_OAUTH_KNOWN_AUTHORITIES ],
          redirectUri: process.env.VUE_APP_HUBHOP_OAUTH_REDIRECT_URI,
        },
        cache: {
          cacheLocation: "localStorage",
        },
      },
      loggedIn: false,
      accessToken: "",
      userSettings: {
        roles: [ process.env.VUE_APP_HUBHOP_ROLES_DEFAULT_ROLE ],
        username: process.env.VUE_APP_HUBHOP_ROLES_DEFAULT_NAME,
      },
    };
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setUserSettings(state, userSettings) {
      state.userSettings = userSettings;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    }
  },
  plugins: [createPersistedState()],
});

export default store;
