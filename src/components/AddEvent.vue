<template>
  <div class="mt-5 container mx-auto">
    <div class="rounded-lg bg-opacity-60">
      <div class="flex justify-between">
        <!-- Add event or variable form -->
        <form class="max-w-2xl text-base">
          <label class="flex text-transparent mb-1 items-start">ph</label>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <select
              class="bg-hhCard text-hhText p-2 w-full rounded-lg border border-hhOrange"
              v-if="!newVendorPlus"
              v-model="vendor"
            >
              <option selected disabled value="">Pick Vendor</option>
              <option
                v-for="vendor in uniqueVendors"
                :value="vendor"
                :key="vendor"
                >{{ vendor }}</option
              >
            </select>
            <input
              v-if="newVendorPlus"
              v-model="newVendor"
              placeholder="Type new vendor name"
              class="bg-hhCard w-full text-hhText p-2 rounded-lg border border-hhOrange"
              type="text"
            />
            <label
              for="vendor"
              class="flex items-center ml-2 justify-center text-base text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              <input type="checkbox" v-model="newVendorPlus" id="vendor" />
              <div class="square-vendor">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </label>
          </div>
          <div class="flex items-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <select
              class="bg-hhCard text-hhText p-2 w-full rounded-lg border border-hhOrange"
              v-if="!newAircraftPlus"
              v-model="aircraft"
            >
              <option selected disabled value="">Pick Aircraft</option>
              <option
                v-for="aircraft in uniqueAircraft"
                :value="aircraft"
                :key="aircraft"
                >{{ aircraft }}</option
              >
            </select>
            <input
              v-if="newAircraftPlus"
              v-model="newAircraft"
              placeholder="Type new aircraft name"
              class="bg-hhCard w-full text-hhText p-2 rounded-lg border border-hhOrange"
              type="text"
            />
            <label
              for="aircraft"
              class="flex items-center ml-2 justify-center text-base text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              <input type="checkbox" v-model="newAircraftPlus" id="aircraft" />
              <div class="square-aircraft">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </label>
          </div>
          <div class="flex items-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <select
              class="bg-hhCard text-hhText p-2 w-full rounded-lg border border-hhOrange"
              v-if="!newSystemPlus"
              v-model="system"
            >
              <option selected disabled value="">Pick System</option>
              <option
                v-for="system in uniqueSystems"
                :value="system"
                :key="system"
                >{{ system }}</option
              >
            </select>
            <input
              v-if="newSystemPlus"
              v-model="newSystem"
              placeholder="Type new system name"
              class="bg-hhCard w-full text-hhText p-2 rounded-lg border border-hhOrange"
              type="text"
            />
            <label
              for="system"
              class="flex items-center ml-2 justify-center text-base text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              <input type="checkbox" v-model="newSystemPlus" id="system" />
              <div class="square-system">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </label>
          </div>
          <div class="flex items-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <select
              class="bg-hhCard text-hhText p-2 w-80 rounded-lg border border-hhOrange"
              v-model="presetType"
            >
              <option value="" disabled selected
                >Input (e.g. Switch) / Output (e.g. LED)</option
              >
              <option value="Input">Input (Button/Switch)</option>
              <option value="Output">Output (LED/7-Segment)</option>
            </select>
            <label
              for="off"
              class="flex items-center ml-2 justify-center text-base text-transparent bg-transparent rounded-md"
            >
              <input type="checkbox" v-model="newSystemPlus" id="system" />
              <div class="square-system">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </label>
          </div>
          <span class="text-red-500 ml-10" v-if="v$.presetType.$error">
            {{ v$.presetType.$errors[0].$message }}
          </span>
        </form>
        <div class="text-base flex flex-col">
          <label class="flex text-hhText mb-1 items-start"
            >Give a precise name</label
          >
          <input
            class="bg-hhCard text-hhText p-2 mb-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="label"
            placeholder="Alternator 1 On"
          />
          <span class="-mt-3 text-red-500" v-if="v$.label.$error">
            {{ v$.label.$errors[0].$message }}
          </span>
          <label class="flex text-hhText text-base items-start"
            >Code to be executed inside the Sim</label
          >
          <textarea
            cols="75"
            rows="5"
            class="break-all text-hhText mb-3 text-base bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="code"
            placeholder="(>L:somecode) (>K:somecodeToo) * near"
          ></textarea>
          <span class="-mt-3 text-red-500" v-if="v$.code.$error">
            {{ v$.code.$errors[0].$message }}
          </span>
          <label class="flex text-hhText items-start">Description</label>
          <textarea
            cols="75"
            rows="5"
            class="break-words text-hhText bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="description"
            placeholder="Anything"
          ></textarea>
          <span class="text-red-500" v-if="v$.description.$error">
            {{ v$.description.$errors[0].$message }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-end mt-5">
    <button
      @click="submitPreset(false)"
      type="button"
      class="mx-5 inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and add more
    </button>
    <button
      @click="submitPreset(true)"
      type="button"
      class="inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and close
    </button>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { PublicClientApplication } from "@azure/msal-browser";

export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  Name: "Add",
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
  },
  data() {
    return {
      vendor: "",
      newVendor: "",
      newVendorPlus: false,
      description: "",
      code: "",
      label: "",
      presetType: "",
      system: "",
      newSystem: "",
      newSystemPlus: false,
      aircraft: "",
      newAircraft: "",
      newAircraftPlus: false,
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
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => (this.presets = data));
  },
  validations() {
    return {
      label: { required },
      code: { required },
      description: { required },
      presetType: { required },
    };
  },
  computed: {
    uniqueVendors() {
      return [...new Set(this.presets.map(({ vendor }) => vendor))];
    },
    uniqueAircraft() {
      return [...new Set(this.presets.map(({ aircraft }) => aircraft))];
    },
    uniqueSystems() {
      return [...new Set(this.presets.map(({ system }) => system))];
    },
  },
  methods: {
    addAndReload() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.submitPreset();
        setTimeout(function() {
          location.reload();
        }, 2000);
      }
    },
    addNewVendor() {
      if (this.newVendorPlus) {
        return this.newVendor;
      }
      return this.vendor;
    },
    addNewAircraft() {
      if (this.newAircraftPlus) {
        return this.newAircraft;
      }
      return this.aircraft;
    },
    addNewSystem() {
      if (this.newSystemPlus) {
        return this.newSystem;
      }
      return this.system;
    },
    submitPreset(onSuccessReload) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      this.v$.$validate();
      if (!this.v$.$error) {
        const url = this.$hubHopApi.baseUrl + "/presets";

        // post body data
        const preset = {
          path:
            this.vendor +
            "." +
            this.aircraft +
            "." +
            this.system +
            "." +
            this.label,
          // vendor: this.vendor,
          vendor: this.addNewVendor(),
          aircraft: this.addNewAircraft(),
          system: this.addNewSystem(),
          code: this.code,
          label: this.label,
          tags: this.tags,
          presetType: this.presetType,
          status: "Submitted",
          createdDate: new Date().toUTCString(),
          // author: this.account.name,
          description: this.description,
        };

        // request options
        const options = {
          method: "POST",
          body: JSON.stringify(preset),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$store.state.accessToken,
          },
        };

        // send POST request
        fetch(url, options).then((res) => {
          if (res.status != 200) return;
          this.$swal({
            position: "center",
            icon: "success",
            title: "Your event/variable has been saved",
            showConfirmButton: false,
            background: "#33353e",
            toast: true,
            timer: 2000,
            willClose: () => {
              if (onSuccessReload) location.reload();
            },
          });
          this.label = "";
          this.code = "";
          this.description = "";
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  color: #d2d0d2 !important;
}

#vendor {
  display: none;
}
#aircraft {
  display: none;
}
#system {
  display: none;
}

.square-vendor {
  transition: all 0.25s;
  transform: rotate(0);
}
.square-aircraft {
  transition: all 0.25s;
  transform: rotate(0);
}
.square-system {
  transition: all 0.25s;
  transform: rotate(0);
}

#vendor:checked + .square-vendor {
  transform: rotate(45deg);
}
#aircraft:checked + .square-aircraft {
  transform: rotate(45deg);
}
#system:checked + .square-system {
  transform: rotate(45deg);
}
</style>
