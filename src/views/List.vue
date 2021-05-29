<template>
  <div class="container mx-auto text-lg mb-10 h-full">
    <!-- Header -->
    <!-- Filter -->
    <h2 class="flex items-start mb-5">Filter</h2>
    <div class="flex justify-between items-center mb-5">
      <div class="flex space-x-5">
        <select
          v-model="filters.vendor.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" selected>All Vendors</option>
          <option value="ASOBO">Asobo</option>
          <option value="Fly by Wire">Fly by Wire Simulation</option>
          <option value="Aerosoft">Aerosoft</option>
          <option value="Working Title">Working Title</option>
        </select>
        <select
          v-model="filters.aircraft.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" selected>All Aircraft</option>
          <option value="A320">A320</option>
          <option value="BONANZA">Bonanza</option>
          <option value="CRJ 550-700">CRJ 550-700</option>
          <option value="CJ4">CJ4</option>
        </select>
        <select
          v-model="filters.status.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" selected>Select Status</option>
          <option value="Submitted">Sumbitted</option>
          <option value="Released">Released</option>
        </select>
        <select
          v-model="filters.type.value"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" selected>Select Input/Output</option>
          <option value="Input">Input</option>
          <option value="Output">Output</option>
        </select>
      </div>

      <AddEventModal />

      <!-- <input v-model="filters.aircraft.value" /> -->
    </div>
    <VTable
      ref="presetList"
      :filters="filters"
      :data="presets"
      :hideSortIcons="true"
      :pageSize="20"
      v-model:currentPage="currentPage"
      @totalPagesChanged="totalPages = $event"
      selectionMode="multiple"
      selectedClass="bg-hhOrange text-hhBG font-bold"
      @stateChanged="selectedRows = $event.selectedRows"
      class="mx-auto bg-hhCard bg-opacity-70 rounded"
      style="width:100%"
    >
      <template #head>
        <tr>
          <VTh sortKey="vendor">Vendor</VTh>
          <VTh sortKey="aircraft">Aircraft</VTh>
          <th>System</th>
          <th>Name</th>
          <th>Status</th>
          <VTh sortKey="presetType">Type</VTh>
          <th>Author</th>
          <th>Version</th>
        </tr>
      </template>
      <template #body="{rows}">
        <VTr :row="preset" v-for="preset in rows" :key="preset.guid">
          <td>{{ preset.vendor }}</td>
          <td>{{ preset.aircraft }}</td>
          <td>{{ preset.system }}</td>
          <td>{{ preset.label }}</td>
          <td>{{ preset.status }}</td>
          <td>{{ preset.presetType }}</td>
          <td>{{ preset.author }}</td>
          <td>{{ preset.version }}</td>
        </VTr>
      </template>
    </VTable>
    <div class="">
      <VTPagination
        class="flex"
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <strong>Selected:</strong>
    <div v-if="selectedRows.length === 0">
      No rows selected
    </div>
    <ul>
      <li v-for="row in selectedRows" :key="row.id">
        {{ row.label }}
      </li>
    </ul>
  </div>
</template>

<script>
import AddEventModal from "../components/AddEventModal.vue";

export default {
  name: "variables",
  components: { AddEventModal },
  methods: {},
  data() {
    return {
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
    fetch("http://localhost:3000/presets")
      .then((res) => res.json())
      .then((data) => (this.presets = data))
      .catch((err) => console.log(err.massage));
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
</style>
