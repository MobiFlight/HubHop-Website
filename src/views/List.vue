<template>
  <div class="container mx-auto text-lg mb-10">
    <!-- Header -->
    <!-- Filter -->
    <h2 class="flex items-start mb-5">Filter</h2>
    <div class="flex justify-between items-center mb-5">
      <div class="flex space-x-5">
        <select
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" disabled selected>Vendor</option>
          <option value="ASOBO">Asobo</option>
          <option value="FBW">Fly by Wire Simulation</option>
          <option value="AS">Aerosoft</option>
          <option value="WT">Working Title</option>
        </select>
        <select
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" disabled selected>Aircraft</option>
          <option value="BONANZA">Bonanza</option>
          <option value="A320">A320</option>
          <option value="AS">CJ4</option>
          <option value="WT">Other</option>
        </select>
        <select
          class="bg-hhCard px-5 py-2 max-w-xs text-lg rounded border-hhOrange"
        >
          <option value="" disabled selected>System</option>
          <option value="ELEC">Electrical</option>
          <option value="AP">Autopilot</option>
          <option value="GLARE">Glareshield</option>
          <option value="WT">Other</option>
        </select>

        <div class="flex items-end"></div>
      </div>
      <AddEventModal />
    </div>

    <VTable
      :data="presets"
      :hideSortIcons="true"
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
        <tr v-for="preset in rows" :key="preset.guid">
          <td>{{ preset.vendor }}</td>
          <td>{{ preset.aircraft }}</td>
          <td>{{ preset.system }}</td>
          <td>{{ preset.label }}</td>
          <td>{{ preset.status }}</td>
          <td>{{ preset.presetType }}</td>
          <td>{{ preset.author }}</td>
          <td>{{ preset.version }}</td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script>
// import { ref } from "vue";
import AddEventModal from "../components/AddEventModal.vue";

export default {
  name: "variables",
  components: { AddEventModal },
  methods: {},
  // setup() {
  //   // The open/closed state lives outside of the Dialog and
  //   // is managed by you.
  //   let isOpen = ref(true);

  //   return {
  //     isOpen,
  //     setIsOpen(value) {
  //       isOpen.value = value;
  //     },
  //     handleDeactivate() {
  //       // ...
  //     },
  //   };
  // },
  data() {
    return {
      presets: [],
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
