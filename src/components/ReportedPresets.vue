<template>
  <div class="md:flex md:space-x-5">
    <div class="w-full">
      <div class="bg-hhCard rounded-lg shadow-lg mb-3 py-3">
        <h3 class="flex items-center justify-center border-hhText mx-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-message-report"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"
            ></path>
            <line x1="12" y1="8" x2="12" y2="11"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line></svg
          >Reported Presets
        </h3>
      </div>
      <div
        class="bg-hhCard justify-center mx-auto rounded-lg shadow-lg py-5 mb-5 xl:mb-0 w-full"
      >
        <div class="mt-3 mx-5 text-base overflow-x-auto" v-if="presets.length">
          <VTable
            ref="presetList"
            :data="reportedPresets"
            :hideSortIcons="true"
            :pageSize="10"
            v-model:currentPage="currentPage"
            @totalPagesChanged="totalPages = $event"
            class="mx-auto text-left xl:text-base text-sm bg-hhCard bg-opacity-70 rounded-t"
            style="width:100%"
          >
            <template #head>
              <tr class="text-base">
                <th>Vendor</th>
                <th>Aircraft</th>
                <th>System</th>
                <th>Preset name</th>
                <th>Type</th>
                <th>Number of reports</th>
                <th>Report Category</th>
                <th>Report Description</th>
              </tr>
            </template>
            <template #body="{rows}">
              <VTr
                class="hover:bg-hhOrange hover:font-bold transition rounded-lg hover:text-hhBG"
                :row="reportedPresets"
                v-for="preset in rows"
                :key="preset.id"
              >
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.vendor }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.aircraft }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.system }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.label }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.presetType }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.reported }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.report_catergory }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'PresetView',
                      params: { id: preset.id },
                    }"
                  >
                    {{ preset.report_description }}
                  </router-link>
                </td>
              </VTr>
            </template>
          </VTable>
          <div
            class="flex items-center justify-between xl:text-base text-sm bg-hhCard bg-opacity-70"
          >
            <VTPagination
              v-if="reportedPresets.length > 10"
              v-model:currentPage="currentPage"
              :total-pages="totalPages"
              :maxPageLinks="10"
            />
          </div>
        </div>
        <div class="container mx-auto" v-else>
          <div class="spinnerSmall flex justify-center items-center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdatedPresets",
  data() {
    return {
      presets: [],
      currentPage: 1,
    };
  },
  computed: {
    reportedPresets: function() {
      return this.presets.filter((report) => {
        return report.reported > 0;
      });
    },
  },
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => {
        this.presets = data;
      });
  },
};
</script>
