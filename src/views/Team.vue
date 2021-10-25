<template>
  <div v-for="preset in presets" :key="preset.id">
    <div v-if="preset.reported > 0">{{ preset.reported }} + {{ preset.report_catergory }} + {{ preset.report_description }} </div>
  </div>
</template>

<script>
export default {
  name: "Team",
  data() {
    return {
      presets: [],
    };
  },
  methods: {},
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/")
      .then((res) => res.json())
      .then((data) => {
        this.presets = data;
      });
  },
};
</script>
