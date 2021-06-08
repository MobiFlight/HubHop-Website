<template>
  <div class="h-full text-lg p-5 my-3 container mx-auto" v-if="preset">
    <div class="flex justify-center mb-5 text-3xl">
      <div class="bg-hhBG rounded-lg border w-screen px-60 border-hhOrange">
        <label class="border-b border-hhOrange">Preset name</label><br />
        <input
          class="my-2 bg-hhCard text-hhText rounded text-center p-1 min-w-full"
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
        <input
          disabled
          class="my-2 bg-hhBG text-hhText rounded text-center p-1"
          v-model="preset.version"
        />
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
        @click="updatePreset(preset.id)"
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
  methods: {
    updatePreset(id, onSuccessReload) {
      const url =
        "https://hubhop.azurewebsites.net/api/presets/" +
        id +
        "?code=ZpSdeNay2NhZNIqrRwx6N/7TDGiTStpL2PTbLe4IZmU3gDF1q11eQQ==";
      // const url = "http://localhost:3000/presets/" + id;

      // post body data
      const preset = {
        path:
          this.preset.vendor +
          "." +
          this.preset.aircraft +
          "." +
          this.preset.system +
          "." +
          this.preset.label,
        vendor: this.preset.vendor,
        aircraft: this.preset.aircraft,
        system: this.preset.system,
        code: this.preset.code,
        label: this.preset.label,
        tags: this.preset.tags,
        presetType: this.preset.presetType,
        status: "Updated",
        version: this.preset.version + 1,
        createdDate: new Date().toUTCString(),
        author: this.preset.author,
        description: this.preset.description,
      };

      // request options
      const options = {
        method: "PATCH",
        body: JSON.stringify(preset),
        headers: {
          "Content-Type": "application/json",
        },
      };
      // send POST request
      fetch(url, options).then((res) => {
        if (res.status != 200) return;
        this.$swal({
          position: "center",
          icon: "success",
          title: "Your event/variable has been saved",
          showConfirmButton: false,
          backdrop: false,
          background: "#33353e",
          toast: true,
          timer: 2000,
          willClose: () => {
            if (onSuccessReload) location.reload();
            this.$router.go(-1);
          },
        });
      });
    },
  },
  mounted() {
    fetch(
      "https://hubhop.azurewebsites.net/api/presets/" +
        this.id +
        "?code=Yut6qZknZj6oTlAqroRT6SSgrAjtQOicgWHdmmzZWVDQi/V6yS/UMQ=="
    )
      .then((res) => res.json())
      .then((data) => (this.preset = data));
  },
};
</script>
