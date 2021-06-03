<template>
  <div class="h-full container mx-auto">
    <div class="p-2 rounded-lg bg-opacity-60">
      <div class="flex mt-5">
        <!-- Add event or variable form -->
        <form class="max-w-2xl text-base flex flex-col">
          <!-- Publisher / vendor -->
          <label class="flex text-transparent mb-1 items-start">ph</label>
          <select
            class="bg-hhCard text-hhText mb-3 p-2 rounded-lg border border-hhOrange"
            v-model="vendor"
          >
            <option value="" disabled selected>Pick the vendor / author</option>
            <option value="ASOBO">Asobo</option>
            <option value="FBW">Fly by Wire</option>
            <option value="WT">Working Title</option>
            <option value="More">Any other vendor</option>
          </select>
          <!-- Aircraft Type -->
          <select
            class="bg-hhCard text-hhText my-3 p-2 rounded-lg border border-hhOrange"
            v-model="aircraft"
          >
            <option value="" disabled selected>Pick the aircraft</option>
            <option value="A320">A320</option>
            <option value="CJ4">CJ4</option>
            <option value="CRJ57">CRJ 500-700</option>
            <option value="AC">Any other aircraft</option>
          </select>
          <!-- system -->
          <select
            class="bg-hhCard text-hhText my-3 p-2 rounded-lg border border-hhOrange"
            v-model="system"
          >
            <option value="" disabled selected>Pick the system</option>
            <option value="AP">Autopilot</option>
            <option value="COM">Radio Stack</option>
            <option value="THR">Throttle</option>
            <option value="INST">Any other system panel</option>
          </select>
          <!-- input or output -->
          <select
            class="bg-hhCard text-hhText my-3 p-2 rounded-lg border border-hhOrange"
            v-model="presetType"
          >
            <option value="" disabled selected>Input/Output</option>
            <option value="Input">Input</option>
            <option value="Output">Output</option>
          </select>

          <label class="flex text-hhText mb-1 items-start"
            >Your name (optional)</label
          >
          <input
            class="bg-hhCard w-80 text-hhText p-2 rounded-lg border border-hhOrange"
            type="text"
            v-model="author"
            placeholder="YourUserName"
          />
        </form>
        <!-- right side of form -->
        <div class="text-base ml-36 flex flex-col">
          <!-- User defined name of variable -->
          <label class="flex text-hhText mb-1 items-start"
            >Give a precise name</label
          >
          <input
            class="bg-hhCard text-hhText p-2 mb-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="label"
            placeholder="Alternator 1 On"
          />
          <!-- Code snippet -->
          <label class="flex text-hhText text-base items-start"
            >Code to be executed inside the Sim</label
          >
          <textarea
            cols="75"
            rows="5"
            class="break-all text-hhText mb-3 text-base bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="code"
            placeholder="(>L:somecode) (>K:somecodeToo) * near"
          ></textarea>
          <!-- Comment for variable -->
          <label class="flex text-hhText items-start">Description</label>
          <textarea
            cols="75"
            rows="5"
            class="break-words text-hhText bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="description"
            placeholder="Anything"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <button
      @click="submitPreset()"
      type="button"
      class="mx-5 inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and add more
    </button>
    <button
      @click="submitPreset(), addAndReload()"
      type="button"
      class="inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and close
    </button>
  </div>
</template>

<script>
export default {
  Name: "Add",
  data() {
    return {
      vendor: "",
      aircraft: "",
      system: "",
      inputOutput: "",
      label: "",
      code: "",
      description: "",
      tags: "",
      presetType: "",
      status: "",
      version: "1",
      createdDate: "",
      author: "",
    };
  },
  methods: {
    addAndReload() {
      this.$swal({
        position: "center",
        icon: "success",
        title: "Your event/variable has been saved",
        showConfirmButton: false,
        backdrop: false,
        background: "#33353e",
        toast: true,
        timer: 2000,
      });
      setTimeout(function() {
        location.reload();
      }, 2000);
    },
    submitPreset() {
      // const url = "https://hubhop.azurewebsites.net/api/presets?code=yJVAredcAmi5YDQDJixvwcaHZC3taYRyVJUI09OLrIplRG8ExHoB1g==";
      const url = "http://localhost:3000/presets";

      // post body data
      const preset = {
        path:
          this.vendor +
          "." +
          this.aircraft +
          "." +
          this.system +
          "." +
          this.label,
        vendor: this.vendor,
        aircraft: this.aircraft,
        system: this.system,
        code: this.code,
        label: this.label,
        tags: this.tags,
        presetType: this.presetType,
        status: "Submitted",
        version: 1,
        createdDate: new Date().toUTCString(),
        author: this.author,
        description: this.description,
      };

      // request options
      const options = {
        method: "POST",
        body: JSON.stringify(preset),
        headers: {
          "Content-Type": "application/json",
        },
      };
      (this.label = ""),
        (this.code = ""),
        (this.description = ""),
        // send POST request
        fetch(url, options)
          .then((res) => res.json())
          .then((res) => console.log(res));
      // Use sweetalert2
      this.$swal({
        position: "center",
        icon: "success",
        title: "Your event/variable has been saved",
        showConfirmButton: false,
        backdrop: false,
        background: "#33353e",
        toast: true,
        timer: 2000,
      });
    },
  },
};
</script>

<style lang="scss">
h2 {
  color: #d2d0d2 !important;
}
</style>
