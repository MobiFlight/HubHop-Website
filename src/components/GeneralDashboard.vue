<template>
  <div>
    <div class="bg-hhCard rounded-lg shadow-lg mb-3 py-3">
      <h3 class="flex items-center justify-center border-hhText mx-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-1 h-8 w-8 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          /></svg
        >Dashboard
      </h3>
    </div>
    <div class="xl:flex xl:space-x-5">
      <div
        class="bg-hhCard justify-center mx-auto rounded-lg shadow-lg py-5 mb-5 xl:mb-0 w-full"
      >
        <div class="space-y-5">
          <div class="xl:grid grid-cols-2 gap-5 px-3 space-y-5 xl:space-y-0">
            <div
              class="bg-hhBG flex flex-col rounded-lg shadow-lg px-5 pt-2 pb-2"
            >
              <h4
                class="border-b border-hhOrange mb-2 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 mb-1 md:mb-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <div class="hidden sm:block">Total presets</div>
              </h4>
              <div class="m-auto">
                <div v-if="presets.length" class="text-4xl xl:-mt-5">
                  {{ presets.length }}
                </div>
                <div v-else>
                  <div
                    class="spinnerSmall flex justify-center items-center"
                  ></div>
                </div>
              </div>
              <div class="text-xs mt-3">
                Number of total presets
              </div>
            </div>
            <div
              class="bg-hhBG flex flex-col rounded-lg shadow-lg px-5 pt-2 pb-2"
            >
              <h4
                class="border-b border-hhOrange mb-2 flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 mb-1 md:mb-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <div class="hidden sm:block">Top contributors</div>
              </h4>
              <div
                v-for="contributor in topThree(contributors)"
                :key="contributor._id"
                class="my-auto py-1 px-2 flex"
              >
                <div class="w-3/4">
                  {{ contributor._id }}
                </div>
                <div class="w-1/4">
                  {{ contributor.contributions }}
                </div>
              </div>
              <div v-if="!contributors.length" class="m-auto">
                <div
                  class="spinnerSmall flex justify-center items-center"
                ></div>
              </div>
              <div class="text-xs mt-3">
                Number of added presets per user
              </div>
            </div>
          </div>
          <div class="xl:grid grid-cols-2 gap-5 px-3 space-y-5 xl:space-y-0">
            <div
              class="bg-hhBG flex flex-col rounded-lg shadow-lg px-5 pt-2 pb-2"
            >
              <h4
                class="border-b border-hhOrange mb-2 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 mb-1 md:mb-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <div class="hidden sm:block">Top aircraft</div>
              </h4>
              <div
                v-for="aircraft in topThree(aircrafts)"
                :key="aircraft._id"
                class="flex my-auto py-1 px-2 text-base"
              >
                <div class="w-3/4">
                  {{ aircraft._id.vendor }} {{ aircraft._id.aircraft }}
                </div>
                <div class="w-1/4">
                  {{ aircraft.presetCount }}
                </div>
              </div>
              <div class="m-auto" v-if="!aircrafts.length">
                <div
                  class="spinnerSmall flex justify-center items-center"
                ></div>
              </div>
              <div class="text-xs mt-3">
                Number of presets per aircraft
              </div>
            </div>
            <div
              class="bg-hhBG flex flex-col rounded-lg shadow-lg px-5 pt-2 pb-2"
            >
              <h4
                class="border-b border-hhOrange mb-2 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-1 mb-1 md:mb-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <div class="hidden sm:block">Top upvotes</div>
              </h4>
              <div
                v-for="vote in topThree(votes)"
                :key="vote._id"
                class="flex my-auto py-1 px-2 text-base hover:bg-hhOrange hover:font-bold transition rounded-lg hover:text-hhBG"
              >
                <div @click="viewPreset(vote._id)" class="w-3/4 cursor-pointer">
                  {{ vote.label }}
                </div>
                <div @click="viewPreset(vote._id)" class="w-1/4 cursor-pointer">
                  {{ vote.score }}
                </div>
              </div>
              <div class="m-auto" v-if="!votes.length">
                <div
                  class="spinnerSmall flex justify-center items-center"
                ></div>
              </div>
              <div class="text-xs mt-3">
                Score of the associated preset
              </div>
            </div>
          </div>
          <div class="container mx-auto px-3">
            <div class="bg-hhBG rounded-lg shadow-lg">
              <h4 class="my-1">Latest added presets</h4>
              <div>
                <div v-if="presetsAdded.length">
                  <VTable
                    ref="presetList"
                    :data="presetsAdded"
                    :hideSortIcons="true"
                    :pageSize="5"
                    v-model:currentPage="currentPageAdded"
                    @totalPagesChanged="totalPages = $event"
                    class="mx-auto xl:text-base text-sm bg-hhCard bg-opacity-70 rounded-t"
                    style="width:100%"
                  >
                    <template #head>
                      <tr class="text-base">
                        <th>Added on</th>
                        <th class="hidden xl:table-cell">Vendor</th>
                        <th>Aircraft</th>
                        <th class="hidden xl:table-cell">System</th>
                        <th>Preset name</th>
                        <th class="hidden sm:table-cell">Type</th>
                        <th class="hidden sm:table-cell">Author</th>
                      </tr>
                    </template>
                    <template #body="{rows}">
                      <VTr
                        class="hover:bg-hhOrange hover:font-bold transition rounded-lg hover:text-hhBG"
                        :row="presetsAdded"
                        v-for="presetAdded in rows"
                        :key="presetAdded._id"
                      >
                        <td @click="viewPreset(presetAdded._id)">
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ formatDate(presetAdded.createdDate) }}
                          </router-link>
                        </td>
                        <td
                          class="hidden xl:table-cell"
                          @click="viewPreset(presetAdded._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.vendor }}
                          </router-link>
                        </td>
                        <td @click="viewPreset(presetAdded._id)">
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.aircraft }}
                          </router-link>
                        </td>
                        <td
                          class="hidden xl:table-cell"
                          @click="viewPreset(presetAdded._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.system }}
                          </router-link>
                        </td>
                        <td
                          class="sm:table-cell"
                          @click="viewPreset(presetAdded._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.label }}
                          </router-link>
                        </td>
                        <td
                          class="hidden sm:table-cell"
                          @click="viewPreset(presetAdded._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.presetType }}
                          </router-link>
                        </td>
                        <td
                          class="hidden sm:table-cell"
                          @click="viewPreset(presetAdded._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetAdded._id },
                            }"
                          >
                            {{ presetAdded.author }}
                          </router-link>
                        </td>
                      </VTr>
                    </template>
                  </VTable>
                  <div
                    class="flex items-center justify-between xl:text-base text-sm bg-hhCard bg-opacity-70"
                  >
                    <VTPagination
                      class=""
                      v-model:currentPage="currentPageAdded"
                      @click="setCurrentPage"
                      :total-pages="totalPages"
                      :maxPageLinks="10"
                    />
                  </div>
                </div>
                <div class="container mx-auto" v-else>
                  <div
                    class="spinnerSmall flex justify-center items-center"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="container mx-auto px-3">
            <div class="bg-hhBG rounded-lg shadow-lg">
              <h4 class="my-1">Latest updated presets</h4>
              <div>
                <div v-if="presetsUpdated.length">
                  <VTable
                    ref="presetList"
                    :data="presetsUpdated"
                    :hideSortIcons="true"
                    :pageSize="5"
                    v-model:currentPage="currentPageUpdated"
                    @totalPagesChanged="totalPages = $event"
                    class="mx-auto xl:text-base text-sm bg-hhCard bg-opacity-70 rounded-t"
                    style="width:100%"
                  >
                    <template #head>
                      <tr class="text-base">
                        <th>Updated on</th>
                        <th class="hidden xl:table-cell">Vendor</th>
                        <th>Aircraft</th>
                        <th class="hidden xl:table-cell">System</th>
                        <th>Preset name</th>
                        <th class="hidden sm:table-cell">Type</th>
                        <th class="hidden sm:table-cell">Updated by</th>
                      </tr>
                    </template>
                    <template #body="{rows}">
                      <VTr
                        class="hover:bg-hhOrange hover:font-bold transition rounded-lg hover:text-hhBG"
                        :row="presetsUpdated"
                        v-for="presetUpdated in rows"
                        :key="presetUpdated._id"
                      >
                        <td @click="viewPreset(presetUpdated._id)">
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ formatDate(presetUpdated.createdDate) }}
                          </router-link>
                        </td>
                        <td
                          class="hidden xl:table-cell"
                          @click="viewPreset(presetUpdated._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.vendor }}
                          </router-link>
                        </td>
                        <td @click="viewPreset(presetUpdated._id)">
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.aircraft }}
                          </router-link>
                        </td>
                        <td
                          class="hidden xl:table-cell"
                          @click="viewPreset(presetUpdated._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.system }}
                          </router-link>
                        </td>
                        <td @click="viewPreset(presetUpdated._id)">
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.label }}
                          </router-link>
                        </td>
                        <td
                          class="hidden sm:table-cell"
                          @click="viewPreset(presetUpdated._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.presetType }}
                          </router-link>
                        </td>
                        <td
                          class="hidden sm:table-cell"
                          @click="viewPreset(presetUpdated._id)"
                        >
                          <router-link
                            :to="{
                              name: 'PresetView',
                              params: { id: presetUpdated._id },
                            }"
                          >
                            {{ presetUpdated.updatedBy }}
                          </router-link>
                        </td>
                      </VTr>
                    </template>
                  </VTable>
                  <div
                    class="flex items-center justify-between xl:text-base text-sm bg-hhCard bg-opacity-70"
                  >
                    <VTPagination
                      class=""
                      v-model:currentPage="currentPageUpdated"
                      @click="setCurrentPage"
                      :total-pages="totalPages"
                      :maxPageLinks="10"
                    />
                  </div>
                </div>
                <div class="container mx-auto" v-else>
                  <div
                    class="spinnerSmall flex justify-center items-center"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GeneralDashboard",
  data() {
    return {
      presets: [],
      contributors: [],
      presetsAdded: [],
      presetsUpdated: [],
      aircrafts: [],
      votes: [],
      totalPages: 1,
      currentPageAdded: 1,
      currentPageUpdated: 1,
      currentPage: 1,
    };
  },
  methods: {
    viewPreset(id) {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId);
        }
        window.scroll(0, window.pageYOffset - 50);
      }, 20);
      this.$router.push({ name: "PresetView", params: { id: id } });
    },
    topThree(list) {
      return list.slice(0, 3);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      // Then specify how you want your dates to be formatted
      return new Intl.DateTimeFormat("default", { dateStyle: "short" }).format(
        date
      );
    },
  },
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets")
      .then((res) => res.json())
      .then((data) => (this.presets = data));

    fetch(this.$hubHopApi.baseUrl + "/statistics/general")
      .then((res) => res.json())
      .then((data) => {
        this.presetsAdded = data.presetsAdded;
        this.presetsUpdated = data.presetsUpdated;
        this.contributors = data.contributors;
        this.aircrafts = data.aircrafts;
        this.votes = data.votes;
      });
  },
};
</script>
