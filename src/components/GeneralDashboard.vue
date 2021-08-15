<template>
  <div>
    <div class="bg-hhCard rounded-lg shadow-lg mb-3 py-3">
      <h3
        class="flex items-center justify-center border-hhText mx-6"
      >
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
    <div class="md:flex md:space-x-5">
      <div
        class="bg-hhCard justify-center mx-auto rounded-lg shadow-lg py-5 mb-5 md:mb-0 w-full"
      >
        <div class="space-y-5">
          <div class="md:grid grid-cols-3 gap-5 px-5">
            <div class="bg-hhBG rounded-lg shadow-lg px-5">
              <h4 class="border-b border-hhOrange">Top Contributors</h4>
              <div class="grid grid-rows-3 my-3">
                <div>
                  User 1
                </div>
                <div>
                  User 2
                </div>
                <div>
                  User 3
                </div>
              </div>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg px-5">
              <h4 class="border-b border-hhOrange">Most complete Aircrafts</h4>
              <div class="grid grid-rows-3 my-3">
                <div>
                  Aircraft 1
                </div>
                <div>
                  Aircraft 2
                </div>
                <div>
                  Aircraft 3
                </div>
              </div>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg px-5">
              <h4 class="border-b border-hhOrange">Top Upvotes</h4>
              <div class="grid grid-rows-3 my-3">
                <div>
                  Preset 1
                </div>
                <div>
                  Preset 2
                </div>
                <div>
                  Preset 3
                </div>
              </div>
            </div>
          </div>
          <div class="container mx-auto px-5">
            <div class="bg-hhBG rounded-lg shadow-lg">
              <h4 class="my-1">Latest added presets</h4>
              <div>
                <div v-if="addedPresets.length">
                  <VTable
                    ref="presetList"
                    :data="addedPresets"
                    :hideSortIcons="true"
                    :pageSize="10"
                    v-model:currentPage="currentPage"
                    @totalPagesChanged="totalPages = $event"
                    class="mx-auto md:text-base text-sm bg-hhCard bg-opacity-70 rounded"
                    style="width:100%"
                  >
                    <template #head>
                      <tr class="text-base">
                        <th class="hidden md:table-cell">Vendor</th>
                        <th>Aircraft</th>
                        <th class="hidden md:table-cell">System</th>
                        <th>Preset name</th>
                        <th>Type</th>
                      </tr>
                    </template>
                    <template #body="{rows}">
                      <VTr
                        class="hover:bg-hhOrange transition rounded-lg hover:text-hhBG"
                        :row="preset"
                        v-for="preset in rows"
                        :key="preset.id"
                      >
                        <td
                          class="py-1.5 hidden md:table-cell"
                          @click="viewPreset(preset.id)"
                        >
                          {{ preset.vendor }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.aircraft }}
                        </td>
                        <td
                          class="hidden md:table-cell"
                          @click="viewPreset(preset.id)"
                        >
                          {{ preset.system }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.label }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.presetType }}
                        </td>
                      </VTr>
                    </template>
                  </VTable>
                </div>
                <div class="container mx-auto" v-else>
                  <div class="spinner"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="container mx-auto px-5">
            <div class="bg-hhBG rounded-lg shadow-lg">
              <h4 class="my-1">Latest updated presets</h4>
              <div>
                <div v-if="updatedPresets.length">
                  <VTable
                    ref="presetList"
                    :data="updatedPresets"
                    :hideSortIcons="true"
                    :pageSize="10"
                    v-model:currentPage="currentPage"
                    @totalPagesChanged="totalPages = $event"
                    class="mx-auto md:text-base text-sm bg-hhCard bg-opacity-70 rounded"
                    style="width:100%"
                  >
                    <template #head>
                      <tr class="text-base">
                        <th class="hidden md:table-cell">Vendor</th>
                        <th>Aircraft</th>
                        <th class="hidden md:table-cell">System</th>
                        <th>Preset name</th>
                        <th>Type</th>
                      </tr>
                    </template>
                    <template #body="{rows}">
                      <VTr
                        class="hover:bg-hhOrange transition rounded-lg hover:text-hhBG"
                        :row="preset"
                        v-for="preset in rows"
                        :key="preset.id"
                      >
                        <td
                          class="py-1.5 hidden md:table-cell"
                          @click="viewPreset(preset.id)"
                        >
                          {{ preset.vendor }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.aircraft }}
                        </td>
                        <td
                          class="hidden md:table-cell"
                          @click="viewPreset(preset.id)"
                        >
                          {{ preset.system }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.label }}
                        </td>
                        <td @click="viewPreset(preset.id)">
                          {{ preset.presetType }}
                        </td>
                      </VTr>
                    </template>
                  </VTable>
                </div>
                <div class="container mx-auto" v-else>
                  <div class="spinner"></div>
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
      addedPresets: [],
      updatedPresets: [],
      totalPages: 1,
      currentPage: 1,
    };
  },
  methods: {
    viewPreset(id) {
      this.$router.push({ name: "PresetView", params: { id: id } });
    },
  },
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => (this.addedPresets = data))
      .then((addedPresets) => console.log(addedPresets));

    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => (this.updatedPresets = data));
  },
};
</script>
