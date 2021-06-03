<template>
  <div class="h-full text-lg p-5 my-3 container mx-auto" v-if="preset">
    <div class="flex justify-center mb-5 text-3xl">
      <div class="bg-hhBG rounded-lg border w-screen border-hhOrange">
        <label class="border-b border-hhOrange">Preset name</label><br />
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.label"
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Vendor</label>
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.vendor"
        />
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Aircraft</label>
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.aircraft"
        />
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">System</label>
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.system"
        />
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Type</label><br />
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.presetType"
        />
      </div>
    </div>
    <div class="flex justify-between mt-5">
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Status</label><br />
        <!-- <select
          v-model="preset.status"
          class="bg-hhCard px-5 py-2 max-w-xs text-lg round"
        >
          <option value="" selected></option>
          <option value="A320">A320</option>
          <option value="BONANZA">Bonanza</option>
          <option value="CRJ 550-700">CRJ 550-700</option>
          <option value="CJ4">CJ4</option>
        </select>
        <select>
          <option value=""></option>
          <option value="Submitted"></option>
          <option value="Released"></option>
          <option value="Outdated"></option>
        </select> -->
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.status"
        />
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-60">
        <label class="border-b border-hhOrange">Author</label>
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.author"
        />
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
        ><br />
        <textarea
          cols="75"
          rows="10"
          class="my-2 bg-hhCard text-hhText rounded text-center m-5 p-1"
          v-model="preset.code"
        />
      </div>
      <div class="bg-hhBG rounded-lg border border-hhOrange w-screen">
        <label class="border-b border-hhOrange">Description</label><br />
        <textarea
          cols="75"
          rows="10"
          class="my-2 bg-hhCard text-hhText rounded text-center p-1"
          v-model="preset.description"
        />
      </div>
    </div>
    <div class="flex justify-between space-x-5">
      <button
        class="text-xl mt-5 px-4 py-2 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        @click="$router.go(-1)"
      >
        Back
      </button>
      <button
        class="text-xl mt-5 px-4 py-2 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        @click="$router.go(-1)"
      >
        Save
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
