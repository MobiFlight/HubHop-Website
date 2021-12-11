import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: process.env.VUE_APP_HUBHOP_OAUTH_CLIENTID,
          authority: process.env.VUE_APP_HUBHOP_OAUTH_AUTHORITY,
          knownAuthorities: [
            process.env.VUE_APP_HUBHOP_OAUTH_KNOWN_AUTHORITIES,
          ],
          redirectUri: process.env.VUE_APP_HUBHOP_OAUTH_REDIRECT_URI,
        },
        cache: {
          cacheLocation: "localStorage",
        },
      },
      loggedIn: false,
      accessToken: "",
      userSettings: {
        roles: [process.env.VUE_APP_HUBHOP_ROLES_DEFAULT_ROLE],
        username: process.env.VUE_APP_HUBHOP_ROLES_DEFAULT_NAME,
      },
      filterVendor: "",
      filterAircraft: "",
      filterSystem: "",
      filterInputType: "",
      filterName: "",
      currentPage: 1,
      pageSize: 15,
      refreshCycle: "default",
      presets: [],
      timestamp: "",
      lastListEdit: null,
      lastListDownload: null,
    };
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setPresets(state, presets) {
      state.presets = presets;
    },
    setUserSettings(state, userSettings) {
      state.userSettings = userSettings;
    },
    setRefreshCycle(state, refreshCycle) {
      state.refreshCycle = refreshCycle;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
    setFilterVendor(state, filterVendor) {
      state.filterVendor = filterVendor;
    },
    setFilterAircraft(state, filterAircraft) {
      state.filterAircraft = filterAircraft;
    },
    setFilterSystem(state, filterSystem) {
      state.filterSystem = filterSystem;
    },
    setFilterInputType(state, filterInputType) {
      state.filterInputType = filterInputType;
    },
    setFilterName(state, filterName) {
      state.filterName = filterName;
    },
    setCurrentPage(state, currentPage) {
      state.currentPage = currentPage;
    },
    setPageSize(state, pageSize) {
      state.pageSize = pageSize;
    },
    setLastListEdit(state, lastListEdit) {
      state.lastListEdit = lastListEdit;
    },
    setLastListDownload(state, lastListDownload) {
      state.lastListDownload = lastListDownload;
    },
  },
  plugins: [createPersistedState()],
});

export default store;
