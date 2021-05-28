<template>
  <div class="h-full container mx-auto">
    <div class="p-2 rounded-lg bg-opacity-60">
      <div class="mt-5 flex items-start justify-around px-14">
        <!-- Add event or variable form -->
        <form class="max-w-2xl flex flex-col">
          <!-- Publisher / vendor -->
          <SelectVendor />
          <!-- Aircraft Type -->
          <select
            class="bg-hhCard my-3 p-3 rounded-lg border border-hhOrange"
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
            class="bg-hhCard my-3 p-3 rounded-lg border border-hhOrange"
            v-model="system"
          >
            <option value="" disabled selected>Pick the system</option>
            <option value="AP">Autopilot</option>
            <option value="COM">Radio Stack</option>
            <option value="THR">Throttle</option>
            <option value="INST">Any other system panel</option>
          </select>
          <!-- User defined name of variable -->
          <label class="flex mt-3 items-start">Give a precise name</label>
          <input
            class="bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="label"
            placeholder="Alternator 1 On"
          />
          <!-- Code snippet -->
          <label class="flex mt-3 items-start"
            >Code to be executed inside the Sim</label
          >
          <textarea
            cols="50"
            rows="5"
            class="break-all font-mono text-sm mb-5 bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="code"
            placeholder="(>L:somecode) (>K:somecodeToo) * near"
          ></textarea>
          <!-- Comment for variable -->
          <label class="flex items-start">Comment</label>
          <textarea
            cols="50"
            rows="5"
            class="break-words mb-5 bg-hhCard p-3 rounded-lg border border-hhOrange"
            type="text"
            v-model="description"
            placeholder="Anything"
          ></textarea>
        </form>
        <div>
          <!-- Code preview section -->

          <div
            class="max-w-2xl flex flex-col bg-hhCard mt-3 p-3 rounded-lg border border-hhOrange"
          >
            <div>
              <h4 class="mb-5">Code to be saved</h4>
              <p
                class="break-words font-mono min-w-min max-w-2xl bg-hhBG p-3 rounded-lg border border-hhOrange"
              >
                {{
                  vendor +
                    "." +
                    aircraft +
                    "." +
                    system +
                    "." +
                    label +
                    "#" +
                    code +
                    "#" +
                    description
                }}
              </p>
            </div>
          </div>
          <!-- Veriable stored list section -->
          <div
            class="max-w-2xl flex flex-col bg-hhCard mt-3 p-3 rounded-lg border border-hhOrange"
          >
            <div>
              <div v-for="name in label" :key="name">{{ name }}</div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-between items-center mt-5">
              <button
                class="bg-hhOrange border font-bold border-hhBG max-w-sm text-hhBG text-2xl py-2 px-10 rounded-lg"
              >
                Add one more
              </button>
              <button
                class="bg-hhOrange border font-bold border-hhBG max-w-sm text-hhBG text-2xl py-2 px-10 rounded-lg"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectVendor from "../components/SelectVendor.vue";

export default {
  data() {
    return {
      vendor: "",
      aircraft: "",
      system: "",
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
  Name: "Add",
  components: {
    SelectVendor,
  },
};
</script>
