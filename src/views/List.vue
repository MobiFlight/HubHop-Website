<template>
  <div class="">
    <div class="container px-3 mx-auto text-base mb-10 min-h-screen">
      <!-- Mobile filter -->
      <div class="block 2xl:hidden -mt-10">
        <h4 class="flex mb-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            /></svg
          >Filter
        </h4>
        <transition name="slide-fade">
          <div
            v-if="filterShow"
            class="grid grid-cols-2 gap-10 justify-between"
          >
            <div class="flex items-start space-y-3 flex-col">
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
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
                  @change="setFilterVendor"
                  v-model="filters.vendor.value"
                  class="bg-hhCard mr-5 px-1 py-1 w-40 text-sm rounded"
                >
                  <option value="">All Vendors</option>
                  <option
                    v-for="vendor in vendorList"
                    :value="vendor"
                    :key="vendor"
                  >
                    {{ vendor }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
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
                  @change="setFilterAircraft"
                  v-model="filters.aircraft.value"
                  class="bg-hhCard mr-5 px-1 py-1 w-40 text-sm rounded"
                >
                  <option value="">All Aircraft</option>
                  <option
                    v-for="aircraft in aircraftList"
                    :value="aircraft"
                    :key="aircraft"
                  >
                    {{ aircraft }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
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
                  @change="setFilterSystem"
                  v-model="filters.system.value"
                  class="bg-hhCard mr-5 px-1 py-1 w-40 text-sm rounded"
                >
                  <option value="">All Systems</option>
                  <option
                    v-for="system in systemList"
                    :value="system"
                    :key="system"
                  >
                    {{ system }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex items-start space-y-3 flex-col">
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
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
                  @change="setFilterInputType"
                  v-model="filters.type.value"
                  class="bg-hhCard px-1 py-1 max-w-xs text-sm rounded"
                >
                  <option value="" selected>Select Input/Output</option>
                  <option value="Input">Input</option>
                  <option value="Input (Potentiometer)">
                    Input (Potentiometer)
                  </option>
                  <option value="Output">Output</option>
                </select>
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <input
                  class="bg-hhCard px-1 py-1 w-36 text-sm rounded"
                  placeholder="Search Preset Name"
                  @keyup="setFilterName"
                  v-model="filters.name.value"
                />
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden sm:block mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <button
                  @click="resetFilters"
                  class="bg-hhBG px-1 py-1 max-w-xs text-sm rounded"
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- Desktop filter -->
      <div class="hidden 2xl:block">
        <h2 class="flex mb-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            /></svg
          >Filter
        </h2>
        <div class="flex justify-between items-center mb-5">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-6 w-6"
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
              @change="setFilterVendor"
              v-model="filters.vendor.value"
              class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded"
            >
              <option value="">All Vendors</option>
              <option
                v-for="vendor in vendorList"
                :value="vendor"
                :key="vendor"
              >
                {{ vendor }}
              </option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-6 w-6"
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
              @change="setFilterAircraft"
              v-model="filters.aircraft.value"
              class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded"
            >
              <option value="">All Aircraft</option>
              <option
                v-for="aircraft in aircraftList"
                :value="aircraft"
                :key="aircraft"
              >
                {{ aircraft }}
              </option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-6 w-6"
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
              @change="setFilterSystem"
              v-model="filters.system.value"
              class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded"
            >
              <option value="">All Systems</option>
              <option
                v-for="system in systemList"
                :value="system"
                :key="system"
              >
                {{ system }}
              </option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-6 w-6"
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
              @change="setFilterInputType"
              v-model="filters.type.value"
              class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded"
            >
              <option value="" selected>Select Input/Output</option>
              <option value="Input">Input</option>
              <option value="Input (Potentiometer)">
                Input (Potentiometer)
              </option>
              <option value="Output">Output</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <input
              class="bg-hhCard px-1 py-1 max-w-xs text-sm rounded"
              placeholder="Search Preset Name"
              @keyup="setFilterName"
              v-model="filters.name.value"
            />
            <button
              @click="resetFilters"
              class="ml-5 flex items-center text-sm p-1 bg-hhBG rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Reset filters
            </button>
          </div>
          <AddEventModal />
        </div>
      </div>
      <div class="flex 2xl:hidden justify-end my-3">
        <AddEventModal />
      </div>
      <!-- Preset List -->
      <div v-if="presets.length">
        <VTable
          ref="presetList"
          :filters="filters"
          :data="presets"
          :hideSortIcons="true"
          :pageSize="pageSize"
          v-model:currentPage="currentPage"
          @totalPagesChanged="totalPages = $event"
          class="mx-auto text-base bg-hhCard bg-opacity-70 rounded"
          style="width: 100%"
        >
          <template #head>
            <tr class="text-base">
              <!-- <th class="hidden md:table-cell">Score</th> -->
              <th class="hidden md:table-cell">Vendor</th>
              <th>Aircraft</th>
              <th class="hidden md:table-cell">System</th>
              <th>Preset name</th>
              <th>Type</th>
            </tr>
          </template>
          <template #body="{ rows }">
            <VTr
              class="
                hover:bg-hhOrange hover:font-bold
                transition
                rounded-lg
                hover:text-hhBG
              "
              :row="preset"
              v-for="preset in rows"
              :key="preset._id"
            >
              <!-- <td
              @click="viewPreset(preset.id)"
              class="hidden md:table-cell"
              v-if="preset.score"
            >
              <router-link
                :to="{ name: 'PresetView', params: { id: preset.id } }"
              >
                {{ preset.score }}
              </router-link>
            </td> -->
              <!-- <td
              @click="viewPreset(preset.id)"
              class="hidden md:table-cell"
              v-else
            >
              <router-link
                :to="{ name: 'PresetView', params: { id: preset.id } }"
              >
                No score
              </router-link>
            </td> -->
              <td
                @click="viewPreset(preset.id)"
                class="py-1.5 hidden md:table-cell"
              >
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  {{ preset.vendor }}
                </router-link>
              </td>
              <td @click="viewPreset(preset.id)">
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  {{ preset.aircraft }}
                </router-link>
              </td>
              <td @click="viewPreset(preset.id)" class="hidden md:table-cell">
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  {{ preset.system }}
                </router-link>
              </td>
              <td @click="viewPreset(preset.id)">
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  {{ preset.label }}
                </router-link>
              </td>
              <td @click="viewPreset(preset.id)">
                <router-link
                  :to="{ name: 'PresetView', params: { id: preset.id } }"
                >
                  {{ preset.presetType }}
                </router-link>
              </td>
            </VTr>
          </template>
        </VTable>
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center">
            <div class="flex flex-col md:flex-row items-center mr-3">
              <VTPagination
                class=""
                v-model:currentPage="currentPage"
                @click="setCurrentPage"
                :total-pages="totalPages"
                :maxPageLinks="10"
              />
              {{ totalPages }} total pages.
            </div>
          </div>
          <div v-if="this.$store.state.refreshCycle === 'manual'">
            Last updated:
            {{
              moment(this.$store.state.presets.timestamp).format(
                "dddd, MMMM Do YYYY, HH:mm:ss"
              )
            }}
          </div>
          <div class="flex items-center">
            <div class="flex item items-center">
              <label>Show number of rows:</label>
              <select
                @click="setPageSize"
                class="bg-hhCard text-hhText ml-1 text-left px-2 rounded-lg"
                v-model.number="pageSize"
              >
                <option selected value="15">15</option>
                <option>25</option>
                <option>50</option>
                <option>75</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            v-if="this.$store.state.refreshCycle === 'manual'"
            @click="downloadPresets()"
            class="
              mt-2
              mr-3
              bg-hhOrange
              flex
              items-center
              px-2
              py-1
              shadow-lg
              rounded-lg
              text-hhBG
              font-bold
            "
          >
            <svg
              v-if="downloadingPresets === true"
              class="animate-spin mr-1 h-5 w-5 text-hhBG"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-if="downloadingPresets === false"
              xmlns="http://www.w3.org/2000/svg"
              class="icon mr-1 icon-tabler icon-tabler-cloud-download"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4"
              ></path>
              <line x1="12" y1="13" x2="12" y2="22"></line>
              <polyline points="9 19 12 22 15 19"></polyline>
            </svg>
            <div>Download presets</div>
          </button>
          <ExportModal v-if="loggedIn" />
        </div>
      </div>
      <div class="container mx-auto" v-else>
        <div class="spinner"></div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="listUpdated"
        class="
          sticky
          bottom-5
          ml-auto
          mr-5
          bg-hhOrange
          w-1/3
          rounded-box
          text-hhBG
        "
      >
        <div class="flex items-center p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <label
            >New presets found online. Hubhop will download the latest
            presets.</label
          >
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="listCached"
        class="
          sticky
          bottom-5
          ml-auto
          mr-5
          bg-hhOrange
          w-1/3
          rounded-box
          text-hhBG
        "
      >
        <div class="flex items-center p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <label
            >No updates found online. No download needed and using cached
            list.</label
          >
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="listNew"
        class="
          sticky
          bottom-5
          ml-auto
          mr-5
          bg-hhOrange
          w-1/3
          rounded-box
          text-hhBG
        "
      >
        <div class="flex items-center p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="w-6 h-6 mx-2 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <label>Downloading initial presets from hubhop.</label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AddEventModal from "../components/AddEventModal.vue";
import ExportModal from "../components/ExportModal.vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "variables",
  components: {
    AddEventModal,
    ExportModal,
  },
  data() {
    return {
      loggedIn: this.$store.state.loggedIn,
      filterShow: true,
      exportModal: false,
      preset: null,
      account: undefined,
      confirmDelete: false,
      roles: this.$store.state.userSettings.roles,
      presets: [],
      pageSize: this.$store.state.pageSize,
      totalPages: 1,
      currentPage: this.$store.state.currentPage,
      selectedRows: [],
      vendorList: [],
      aircraftList: [],
      systemList: [],
      filters: {
        aircraft: {
          value: this.$store.state.filterAircraft,
          keys: ["aircraft"],
          exact: true,
        },
        vendor: {
          value: this.$store.state.filterVendor,
          keys: ["vendor"],
          exact: true,
        },
        system: {
          value: this.$store.state.filterSystem,
          keys: ["system"],
          exact: true,
        },
        name: {
          value: this.$store.state.filterName,
          keys: ["label"],
        },
        type: {
          value: this.$store.state.filterInputType,
          keys: ["presetType"],
          exact: true,
        },
        status: { value: "", keys: ["status"], exact: true },
      },
      downloadingPresets: false,
      listUpdated: false,
      listCached: false,
      listNew: false,
    };
  },

  async created() {
    this.moment = moment;
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
    if (this.$store.state.loggedIn == true) {
      return this.getAccessToken().then(() => this.getUserSettings());
    }
  },
  watch: {
    "filters.vendor.value": function () {
      this.updateAircraftList();
    },
    "filters.aircraft.value": function () {
      this.updateVendorList();
      this.updateSystemList();
    },
    presets: function () {
      this.updateVendorList();
      this.updateAircraftList();
      this.updateSystemList();
    },
  },
  methods: {
    async downloadPresets() {
      this.downloadingPresets = true;
      const response = await fetch(this.$hubHopApi.baseUrl + "/presets/");
      const data = await response.json();
      if (response.status != 200)
        return alert("Something went wrong... Try again");
      {
        this.$store.state.presets.presets = data;
        this.presets = this.$store.state.presets.presets;
        this.$store.state.presets.timestamp = moment();
        this.downloadingPresets = false;
      }
    },
    updateVendorList() {
      this.vendorList = [
        ...new Set(
          this.presets
            .filter((preset) => {
              return (
                this.filters.aircraft.value == "" ||
                this.filters.aircraft.value == preset.aircraft
              );
            })
            .map(({ vendor }) => vendor)
        ),
      ].sort();
    },
    updateAircraftList() {
      this.aircraftList = [
        ...new Set(
          this.presets
            .filter((preset) => {
              return (
                this.filters.vendor.value == "" ||
                this.filters.vendor.value == preset.vendor
              );
            })
            .map(({ aircraft }) => aircraft)
        ),
      ].sort();
    },
    updateSystemList() {
      this.systemList = [
        ...new Set(
          this.presets
            .filter((preset) => {
              return (
                this.filters.aircraft.value == "" ||
                this.filters.aircraft.value == preset.aircraft
              );
            })
            .map(({ system }) => system)
        ),
      ].sort();
    },
    showExportModal() {
      this.exportModal = !this.exportModal;
    },
    viewPreset(id) {
      this.$router.push({ name: "PresetView", params: { id: id } });
    },
    resetFilters() {
      this.$store.commit("setFilterVendor", "");
      this.$store.commit("setFilterAircraft", "");
      this.$store.commit("setFilterSystem", "");
      this.$store.commit("setFilterInputType", "");
      this.$store.commit("setFilterName", "");
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
      this.filters.vendor.value = "";
      this.filters.name.value = "";
      (this.filters.aircraft.value = ""),
        (this.filters.system.value = ""),
        (this.filters.type.value = "");
    },
    setFilterVendor() {
      this.$store.commit("setFilterVendor", this.filters.vendor.value);
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
    },
    setFilterAircraft() {
      this.$store.commit("setFilterAircraft", this.filters.aircraft.value);
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
    },
    setFilterSystem() {
      this.$store.commit("setFilterSystem", this.filters.system.value);
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
    },
    setFilterInputType() {
      this.$store.commit("setFilterInputType", this.filters.type.value);
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
    },
    setFilterName() {
      this.$store.commit("setFilterName", this.filters.name.value);
      this.$store.commit("setCurrentPage", 1);
      this.currentPage = 1;
    },
    setCurrentPage() {
      this.$store.commit("setCurrentPage", this.currentPage);
    },
    setPageSize() {
      this.$store.commit("setPageSize", this.pageSize);
    },
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
    ...mapMutations(["setAccessToken", "setUserSettings"]),
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
            this.$store.commit("setLastListEdit", preset.createdDate);
          }
        });
    },
  },
  // updated() {
  //   if (
  //     moment(this.$store.state.lastListEdit) >
  //     moment(this.$store.state.lastListDownload)
  //   ) {
  //     this.listUpdated = true;
  //     setTimeout(() => {
  //       this.listUpdated = false;
  //     }, 5000);
  //     console.log("es gibt änderungen");
  //     fetch(this.$hubHopApi.baseUrl + "/presets/")
  //       .then((res) => res.json())
  //       .then((data) => (this.presets = data))
  //       .then(
  //         (data) => this.$store.commit("setPresets", data),
  //         this.$store.commit("setLastListDownload", moment())
  //       );
  //   } else {
  //     this.listCached = true;
  //     setTimeout(() => {
  //       this.listCached = false;
  //     }, 5000);
  //     console.log("es gibt keine änderungen");
  //     this.presets = this.$store.state.presets;
  //   }
  // },
  mounted() {
    this.getLastPreset();
    if (this.$store.state.lastListDownload == null) {
      fetch(this.$hubHopApi.baseUrl + "/presets/")
        .then((res) => res.json())
        .then((data) => (this.presets = data))
        .then(
          (data) => this.$store.commit("setPresets", data),
          this.$store.commit("setLastListDownload", moment()),
          (this.listNew = true),
          setTimeout(() => {
            this.listNew = false;
          }, 5000)
        );
    } else {
      if (
        moment(this.$store.state.lastListEdit) >
        moment(this.$store.state.lastListDownload)
      ) {
        this.listUpdated = true;
        setTimeout(() => {
          this.listUpdated = false;
        }, 5000);
        console.log("es gibt änderungen");
        fetch(this.$hubHopApi.baseUrl + "/presets/")
          .then((res) => res.json())
          .then((data) => (this.presets = data))
          .then(
            (data) => this.$store.commit("setPresets", data),
            this.$store.commit("setLastListDownload", moment())
          );
      } else {
        this.listCached = true;
        setTimeout(() => {
          this.listCached = false;
        }, 5000);
        console.log("es gibt keine änderungen");
        this.presets = this.$store.state.presets;
      }
    }

    // .then(() => (this.presets = this.$store.state.presets.presets));
    // if (moment() <= this.$store.state.lastListEdit) {
    //   console.log("früher: " + this.$store.state.lastListEdit);
    // } else console.log("später: " + this.$store.state.lastListEdit);
    // if (
    //   this.$store.state.refreshCycle === "default" ||
    //   this.$store.state.refreshCycle === "dynamic"
    // ) {
    //   return (
    //     console.log("Default download mode. Downloading presets from Azure..."),
    //     fetch(this.$hubHopApi.baseUrl + "/presets/")
    //       .then((res) => res.json())
    //       .then((data) => (this.presets = data))
    //       .then(
    //         (data) => (this.$store.state.presets.presets = data),
    //         (this.$store.state.presets.timestamp = moment())
    //       )
    //       .then(() => (this.presets = this.$store.state.presets.presets))
    //   );
    // }
    // if (this.$store.state.refreshCycle === "manual") {
    //   if (!this.$store.state.presets.presets.length) {
    //     return (
    //       console.log("No presets found. Downloading inital presets..."),
    //       fetch(this.$hubHopApi.baseUrl + "/presets/")
    //         .then((res) => res.json())
    //         .then(
    //           (data) => (this.$store.state.presets.presets = data),
    //           (this.$store.state.presets.timestamp = moment())
    //         )
    //         .then(() => (this.presets = this.$store.state.presets.presets))
    //     );
    //   }
    //   return (
    //     console.log("Manual download mode. Using downloaded presets."),
    //     (this.presets = this.$store.state.presets.presets)
    //   );
    // }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
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
.spinnerSmall:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border-top: 2px solid rgb(255, 160, 71);
  border-right: 2px solid transparent;
  animation: spinner 0.6s linear infinite;
}
</style>
