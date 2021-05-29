<template>
  <div class="h-full container mx-auto">
    <div class="p-2 rounded-lg bg-opacity-60">
      <div class="mt-5 flex items-start justify-around px-14">
        <!-- Add event or variable form -->
        <form class="max-w-2xl text-base flex flex-col">
          <!-- Publisher / vendor -->
          <select
            class="bg-hhCard text-hhText my-3 p-2 rounded-lg border border-hhOrange"
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
            <option value="" disabled selected>Pick the Aircraft</option>
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
            v-model="inputOutput"
          >
            <option value="" disabled selected>Input/Output</option>
            <option value="INPUT">Input</option>
            <option value="OUTPUT">Output</option>
          </select>
          <!-- User defined name of variable -->
          <label class="flex text-hhText mb-1 items-start"
            >Give a precise name</label
          >
          <input
            class="bg-hhCard w-80 text-hhText p-2 rounded-lg border border-hhOrange"
            type="text"
            v-model="label"
            placeholder="Alternator 1 On"
          />
        </form>
        <!-- right side of form -->
        <div>
          <!-- Code snippet -->
          <label class="flex text-hhText text-base items-start"
            >Code to be executed inside the Sim</label
          >
          <textarea
            cols="75"
            rows="5"
            class="break-all text-hhText font-mono text-sm mb-5 bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="code"
            placeholder="(>L:somecode) (>K:somecodeToo) * near"
          ></textarea>
          <!-- Comment for variable -->
          <label class="flex text-hhText items-start">Comment</label>
          <textarea
            cols="100"
            rows="5"
            class="break-words mb-5 text-hhText bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="description"
            placeholder="Anything"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      version: "0.1",
      createdDate: "",
      author: "",
    };
  },
  Name: "Add",
  mounted() {
    fetch("http://localhost:3000/presets")
      .then((res) => res.json())
      .then((data) => (this.presets = data))
      .catch((err) => console.log(err.massage));
  },
};
</script>
