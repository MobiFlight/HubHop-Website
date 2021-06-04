<template>
  <div class="h-full text-lg p-5 mb-3 container mx-auto" v-if="preset">
    <div class="flex justify-center mb-5 text-3xl">
      <div class="bg-hhBG rounded-lg border w-screen border-hhOrange">
        <label class="border-b border-hhOrange">Preset name</label>
        <p class="p-2 pt-5">{{ preset.label }}</p>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Vendor</label>
        <p class="pt-2">{{ preset.vendor }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Aircraft</label>
        <p class="pt-2">{{ preset.aircraft }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">System</label>
        <p class="pt-2">{{ preset.system }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Type</label>
        <p class="pt-2">{{ preset.presetType }}</p>
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Status</label>
        <p class="pt-2">{{ preset.status }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Author</label>
        <p class="pt-2">{{ preset.author }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Version</label>
        <p class="pt-2">{{ preset.version }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Submitted on</label>
        <p class="pt-2">{{ preset.createdDate }}</p>
      </div>
    </div>
    <div class="flex justify-around space-x-10 mt-5">
      <div class="bg-hhBG rounded-lg border border-hhOrange w-screen">
        <label class="border-b px-5 border-hhOrange"
          >Code to be executed (single line)</label
        >
        <p class="p-2 font-mono">{{ preset.code }}</p>
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-screen">
        <label class="border-b border-hhOrange">Description</label>
        <p class="pt-2">
          {{ preset.description }}
        </p>
      </div>
    </div>
    <div class="flex justify-start">
      <button
        class="text-xl mt-5 px-4 py-2 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        @click="$router.go(-1)"
      >
        Back
      </button>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      preset: null,
    };
  },
  mounted() {
    fetch("http://localhost:3000/presets/" + this.id)
      .then((res) => res.json())
      .then((data) => (this.preset = data))
      .catch((err) => console.log(err.massage));
  },
};
</script>
