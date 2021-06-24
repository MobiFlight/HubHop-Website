<template>
  <div class="container mx-auto text-lg mb-10 h-full">
    <h2 class="flex items-start mb-5">Filter</h2>
    <div class="flex justify-between items-center mb-5">
      <div class="flex items-center space-x-5">
        <select
          v-model="filters.vendor.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded"
        >
          <option value="">All Vendors</option>
          <option
            v-for="vendor in uniqueVendors"
            :value="vendor"
            :key="vendor"
            >{{ vendor }}</option
          >
        </select>
        <select
          v-model="filters.aircraft.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded"
        >
          <option value="">All Aircraft</option>
          <option
            v-for="aircraft in uniqueAircraft"
            :value="aircraft"
            :key="aircraft"
            >{{ aircraft }}</option
          >
        </select>
        <select
          v-model="filters.system.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded"
        >
          <option value="">All Systems</option>
          <option
            v-for="system in uniqueSystem"
            :value="system"
            :key="system"
            >{{ system }}</option
          >
        </select>
        <select
          v-model="filters.type.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded"
        >
          <option value="" selected>Select Input/Output</option>
          <option value="Input">Input</option>
          <option value="Output">Output</option>
        </select>
        <input
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded"
          placeholder="Search Preset Name"
          v-model="filters.name.value"
        />
      </div>
      <AddEventModal />
    </div>
    <!-- Preset List -->
    <div v-if="presets.length">
      <VTable
        ref="presetList"
        :filters="filters"
        :data="presets"
        :hideSortIcons="true"
        :pageSize="15"
        v-model:currentPage="currentPage"
        @totalPagesChanged="totalPages = $event"
        selectionMode="multiple"
        selectedClass="bg-hhOrange text-hhBG font-bold transition duration-150 ease-in-out"
        @stateChanged="selectedRows = $event.selectedRows"
        class="mx-auto text-base bg-hhCard bg-opacity-70 rounded"
        style="width:100%"
      >
        <template #head>
          <tr class="text-lg">
            <th>Vendor</th>
            <th>Aircraft</th>
            <th>System</th>
            <th>Preset name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </template>
        <template #body="{rows}">
          <VTr :row="preset" v-for="preset in rows" :key="preset._id">
            <td>{{ preset.vendor }}</td>
            <td>{{ preset.aircraft }}</td>
            <td>{{ preset.system }}</td>
            <td>{{ preset.label }}</td>
            <td>{{ preset.description }}</td>
            <td>{{ preset.presetType }}</td>
            <td>
              <div class="flex items-center py-0.5 justify-center">
                <!-- Button view -->
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  <button
                    class="inline-flex items-center mr-2 h-8 w-8 py-1 px-2 font-medium text-hhText bg-hhBG rounded-md hover:bg-hhOrange hover:text-hhBG focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </router-link>
                <router-link
                  v-if="roles.includes('Moderator')"
                  :to="{ name: 'PresetEdit', params: { id: preset.id } }"
                >
                  <button
                    class="inline-flex items-center mr-2 justify-center h-8 w-8 py-1 px-2 font-medium text-hhText bg-hhBG rounded-md hover:bg-hhOrange hover:text-hhBG focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </button>
                </router-link>
                <button
                  v-if="roles.includes('Moderator')"
                  @click="confirmDelete = !confirmDelete"
                  class="inline-flex items-center justify-center h-8 w-8 py-1 px-2 font-medium text-hhText bg-hhBG rounded-md hover:bg-hhOrange hover:text-hhBG focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  v-if="confirmDelete"
                  @click="deletePreset(preset.id), (confirmDelete = false)"
                  class="inline-flex items-center justify-center py-1 px-2 ml-2 font-medium text-hhText bg-red-900 rounded-md hover:bg-red-700 hover:text-hhText focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  v-if="confirmDelete"
                  @click="confirmDelete = false"
                  class="inline-flex items-center justify-center py-1 px-2 ml-2 font-medium text-hhText bg-hhBG rounded-md hover:bg-gray-700 hover:text-hhText focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </td>
          </VTr>
        </template>
      </VTable>
      <VTPagination
        class="flex"
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <div v-else>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import AddEventModal from "../components/AddEventModal.vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { mapMutations } from "vuex";

export default {
  name: "variables",
  components: {
    AddEventModal,
  },
  created() {
    if (this.$store.state.loggedIn == true) {
      return this.getAccessToken().then(() => this.getUserSettings());
    }
  },
  methods: {
    async getAccessToken() {
      let request = {
        scopes: [process.env.VUE_APP_HUBHOP_OAUTH_SCOPES],
        account: this.$store.state.userSettings.username,
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
    ...mapMutations(["setAccessToken", "setUserSettings"]),
    deletePreset(id) {
      fetch(this.$hubHopApi.baseUrl + "/presets/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      }).then((res) => {
        if (res.status != 200) return;
        this.$swal({
          position: "center",
          icon: "success",
          title: "Your event/variable has been removed",
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 2000,
        });
      });
      this.presets = this.presets.filter((preset) => preset.id != id);
    },
  },
  data() {
    return {
      account: undefined,
      confirmDelete: false,
      roles: this.$store.state.userSettings.roles,
      presets: [],
      totalPages: 1,
      currentPage: 1,
      selectedRows: [],
      filters: {
        aircraft: { value: "", keys: ["aircraft"] },
        vendor: { value: "", keys: ["vendor"] },
        system: { value: "", keys: ["system"] },
        name: { value: "", keys: ["label"] },
        type: { value: "", keys: ["presetType"] },
        status: { value: "", keys: ["status"] },
      },
    };
  },
  computed: {
    uniqueVendors() {
      return [...new Set(this.presets.map(({ vendor }) => vendor))];
    },
    uniqueAircraft() {
      return [...new Set(this.presets.map(({ aircraft }) => aircraft))];
    },
    uniqueSystem() {
      return [...new Set(this.presets.map(({ system }) => system))];
    },
  },
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => (this.presets = data));
  },
};
</script>

<style lang="scss">
ul.pagination {
  font-size: large;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
li.page-item {
  display: flex;
  align-items: center;
  margin: 5px;
}
li.active {
  color: rgb(255, 160, 71);
  font-weight: bold;
  font-size: larger;
  align-items: center;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border-top: 2px solid rgb(255, 160, 71);
  border-right: 2px solid transparent;
  animation: spinner 0.6s linear infinite;
}
</style>
