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
          <span class="-mt-3 text-red-500" v-if="v$.vendor.$error">
            {{ v$.vendor.$errors[0].$message }}
          </span>
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
          <span class="-mt-3 text-red-500" v-if="v$.aircraft.$error">
            {{ v$.aircraft.$errors[0].$message }}
          </span>
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
          <span class="-mt-3 text-red-500" v-if="v$.system.$error">
            {{ v$.system.$errors[0].$message }}
          </span>
          <!-- input or output -->
          <select
            class="bg-hhCard text-hhText my-3 p-2 rounded-lg border border-hhOrange"
            v-model="presetType"
          >
            <option value="" disabled selected>Input/Output</option>
            <option value="Input">Input</option>
            <option value="Output">Output</option>
          </select>
          <span class="-mt-3 text-red-500" v-if="v$.presetType.$error">
            {{ v$.presetType.$errors[0].$message }}
          </span>
          <label class="flex text-hhText mb-1 items-start"
            >Your name (optional)</label
          >
          <input
            class="bg-hhCard w-80 text-hhText p-2 rounded-lg border border-hhOrange"
            type="text"
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
          <span class="-mt-3 text-red-500" v-if="v$.label.$error">
            {{ v$.label.$errors[0].$message }}
          </span>
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
          <span class="-mt-3 text-red-500" v-if="v$.code.$error">
            {{ v$.code.$errors[0].$message }}
          </span>
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
          <span class="text-red-500" v-if="v$.description.$error">
            {{ v$.description.$errors[0].$message }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <button
      @click="submitPreset(false)"
      type="button"
      class="mx-5 inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and add more
    </button>
    <button
      @click="submitPreset(true)"
      type="button"
      class="inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      Submit and close
    </button>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { PublicClientApplication } from "@azure/msal-browser";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  Name: "Add",
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
  },
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
      status: "Submitted",
      version: 1,
      createdDate: "",
    };
  },
  validations() {
    return {
      vendor: { required },
      aircraft: { required },
      system: { required },
      label: { required },
      code: { required },
      description: { required },
      presetType: { required },
    };
  },
  methods: {
    addAndReload() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.submitPreset();
        setTimeout(function() {
          location.reload();
        }, 2000);
      }
    },
    submitPreset(onSuccessReload) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      this.v$.$validate();
      if (!this.v$.$error) {
        const url =
          "https://hubhop.azurewebsites.net/api/presets?code=yJVAredcAmi5YDQDJixvwcaHZC3taYRyVJUI09OLrIplRG8ExHoB1g==";

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
          author: this.account.name,
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
        this.label = "";
        this.code = "";
        this.description = "";
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
            },
          });
        });
      }
    },
  },
};
</script>

<style lang="scss">
h2 {
  color: #d2d0d2 !important;
}
</style>
