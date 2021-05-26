<template>
  <div class="h-full container mx-auto flex flex-col">
    <button
      class="bg-hhOrange px-5 py-2 max-w-xs text-hhCard text-2xl mb-5 rounded"
    >
      Add event
    </button>

    <VTable
      :data="presets"
      class=" mx-auto bg-hhCard bg-opacity-70 rounded"
      style="width:100%"
    >
      <template #head>
        <tr>
          <th>Vendor</th>
          <th>Aircraft</th>
          <th>System</th>
          <th>Label</th>
          <th>Status</th>
          <th>Type</th>
          <th>Author</th>
          <th>Version</th>
        </tr>
      </template>
      <template #body="{rows}">
        <tr v-for="preset in rows" :key="preset.id">
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
export default {
  name: "variables",
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
