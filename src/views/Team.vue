<template>
  <div>
    something
    <button @click="count">count</button>
    <select
      @change="count"
      v-model="selectedVendor"
      class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded"
    >
      <option value="">All Vendors</option>
      <option v-for="vendor in vendorList" :value="vendor" :key="vendor">
        {{ vendor }}</option
      >
    </select>
    <select class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded">
      <option value="">All Aircraft</option>
      <option
        v-for="aircraft in aircraftList"
        :value="aircraft"
        :key="aircraft"
        >{{ aircraft }}</option
      >
    </select>
    <select class="bg-hhCard mr-5 px-1 py-1 max-w-xs text-sm rounded">
      <option value="">All Systems</option>
      <option v-for="system in systemList" :value="system" :key="system">{{
        system
      }}</option>
    </select>
    <p>{{ numberOfVendor }}</p>
  </div>
</template>

<script>
export default {
  name: "Team",
  data() {
    return {
      presets: [],
      selectedVendor: "",
      numberOfVendor: 1,
      uniqueSortedVendor: [],
      vendorList: [],
      aircraftList: [],
      systemList: [],
    };
  },
  watch: {
    selectedVendor: function() {
      this.updateAircraftList();
    },
    presets: function() {
      this.updateVendorList();
      this.updateAircraftList();
      this.updateSystemList();
    },
  },
  methods: {
    updateVendorList() {
      this.vendorList = [
        ...new Set(this.presets.map(({ vendor }) => vendor)),
      ].sort();
    },
    updateAircraftList() {
      this.aircraftList = [
        ...new Set(
          this.presets
            .filter((preset) => {
              return (
                this.selectedVendor == "" ||
                this.selectedVendor == preset.vendor
              );
            })
            .map(({ aircraft }) => aircraft)
        ),
      ].sort();
    },
    updateSystemList() {
      this.systemList = [
        ...new Set(this.presets.map(({ system }) => system)),
      ].sort();
    },
    count() {
      var selection = this.selectedVendor;
      var count = this.presets.filter((preset) => {
        if (preset.vendor === selection) {
          return true;
        } else {
          return false;
        }
      });
      this.numberOfVendor = count.length;
      console.log(this.numberOfVendor);
      console.log(this.uniqueSortedVendor);
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
