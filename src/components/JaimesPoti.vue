<template>
  <div class="mt-5 container mx-auto">
    <h3 class="mb-5">JAIME'S POTENTIOMETER RPN CODE GENERATOR</h3>
    <div class="md:flex md:justify-center md:space-x-5 mx-5">
      <div class="flex flex-col space-y-2 w-full md:w-1/2">
        <div class="mb-3">Device Output Range</div>
        <select v-model="dor_selected" class="select select-bordered w-full">
          <option disabled value="Select preset" selected>Select preset</option>
          <option v-for="dor in dor_preset" :key="dor.name">
            {{ dor.name }}
          </option>
        </select>
        <div class="grid grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Min device output range</span>
            </label>
            <input
              v-model="dor_min"
              type="number"
              placeholder="Min"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Max device output range</span>
            </label>
            <input
              v-model="dor_max"
              type="number"
              placeholder="Max"
              class="input input-bordered"
            />
          </div>
        </div>
      </div>
      <!-- msfs input range -->
      <div class="flex flex-col space-y-2 w-full md:w-1/2">
        <div class="my-3 md:mb-3 md:mt-0">MSFS2020 Event Input Range</div>
        <select v-model="eir_selected" class="select select-bordered w-full">
          <option disabled value="Select preset" selected>Select preset</option>
          <option v-for="eir in eir_preset" :key="eir.name">
            {{ eir.name }}
          </option>
        </select>
        <div class="grid grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Min event input range</span>
            </label>
            <input
              v-model="eir_min"
              type="number"
              placeholder="Min"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Max event input range</span>
            </label>
            <input
              v-model="eir_max"
              type="number"
              placeholder="Max"
              class="input input-bordered"
            />
          </div>
        </div>
        <div class="text-left text-sm">
          Note: The scale can be inverted by inverting the Min and Max values.
        </div>
        <button
          class="
            bg-hhOrange
            flex
            justify-center
            items-center
            mx-auto
            px-10
            py-1
            text-hhBG
            font-bold
            rounded-box
            text-base
          "
          @click="invertMinMax"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon mr-1 icon-tabler icon-tabler-exchange"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="5" cy="18" r="2"></circle>
            <circle cx="19" cy="6" r="2"></circle>
            <path d="M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3"></path>
            <path d="M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3"></path></svg
          >Invert values
        </button>
      </div>
    </div>
    <!-- RPN code -->
    <div class="m-5">
      <div class="mb-3">Generated RPN statement</div>
      <div class="form-control">
        <textarea
          id="rpn_code"
          rows="3"
          v-model="rpnStatement"
          type="text"
          placeholder="RPN"
          class="textarea border border-hhOrange"
        /><button class="text-sm text-right pt-2" @click="copyCodeDesktop">
          Copy to clipboard
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import useClipboard from "vue-clipboard3";

export default {
  name: "Tools",
  data() {
    return {
      dor_preset: [
        { name: "Arduino", min: 0, max: 1023 },
        { name: "Joystick", min: 0, max: 65535 },
        { name: "Custom", min: 0, max: 0 },
      ],
      eir_preset: [
        {
          name: "Aileron",
          min: "-16383",
          max: "16383",
          event: "AILERON_SET",
        },
        {
          name: "Elev",
          min: "-16383",
          max: "16383",
          event: "ELEVATOR_SET",
        },
        {
          name: "Flaps",
          min: "0",
          max: "16383",
          event: "FLAPS_SET",
        },
        {
          name: "Light pot",
          min: "0",
          max: "100",
          event: "2:LIGHT_POTENTIOMETER_SET",
        },
        {
          name: "Com volume",
          min: "0",
          max: "100",
          event: "COM1_VOL_SET",
        },
        {
          name: "Mixture",
          min: "0",
          max: "16383",
          event: "MIXTURE_SET",
        },
        {
          name: "Prop",
          min: "0",
          max: "16383",
          event: "PROP_PITCH_SET",
        },
        {
          name: "PWM",
          min: "0",
          max: "255",
          event: "PWM",
        },
        {
          name: "Rudder",
          min: "-16383",
          max: "16383",
          event: "RUDDER_SET",
        },
        {
          name: "Spoiler",
          min: "0",
          max: "16383",
          event: "SPOILERS_SET",
        },
        {
          name: "Thr/Rev",
          min: "-16383",
          max: "16383",
          event: "THROTTLE_SET",
        },
        {
          name: "Throttle",
          min: "0",
          max: "16383",
          event: "THROTTLE_SET",
        },
        {
          name: "User",
          min: "0",
          max: "16383",
          event: "Your_Event_SET",
        },
      ],
      dor_selected: "Select preset",
      dor_min: 0,
      dor_max: 0,
      eir_selected: "Select preset",
      eir_min: 0,
      eir_max: 0,
      selectedEvent: "",
    };
  },
  computed: {
    eir_delta() {
      return this.eir_max - this.eir_min;
    },
    dor_delta() {
      return this.dor_max - this.dor_min;
    },
    dor_eir_ratio() {
      return (this.eir_delta / this.dor_delta).toFixed(4);
    },
    dor_eir_ratio2() {
      return (this.dor_delta / this.eir_delta).toFixed(4);
    },
    rpnDorMin() {
      if (this.dor_min == 0) {
        return "";
      } else {
        return this.dor_min + " - ";
      }
    },
    rpnGrRatio() {
      if (Math.abs(this.dor_eir_ratio) > Math.abs(this.dor_eir_ratio2)) {
        return this.dor_eir_ratio;
      } else {
        return this.dor_eir_ratio2;
      }
    },
    rpnGrRatioMath() {
      if (Math.abs(this.dor_eir_ratio) > Math.abs(this.dor_eir_ratio2)) {
        return "* ";
      } else {
        return "/ ";
      }
    },
    rpnEirMin() {
      if (this.eir_min == 0) {
        return "";
      } else {
        return Math.abs(this.eir_min);
      }
    },
    rpnEirMinMath() {
      if (this.eir_min == 0) {
        return "";
      } else {
        if (this.eir_min > 0) {
          return " + ";
        } else {
          return " - ";
        }
      }
    },
    rpnMin() {
      return Math.min(this.eir_min, this.eir_max);
    },
    rpnMax() {
      return Math.max(this.eir_min, this.eir_max);
    },
    rpnLeft() {
      for (let index = 0; index < this.eir_preset.length; index++) {
        const preset = this.eir_preset[index];
        if (preset.name == this.eir_selected) {
          if (preset.event.substring(0, 1) == 2) {
            return "index ";
          } else "";
        }
      }
      return "";
    },
    rpnFindEvent() {
      for (let index = 0; index < this.eir_preset.length; index++) {
        const preset = this.eir_preset[index];
        if (preset.name == this.eir_selected) {
          return preset.event;
        } else "";
      }
      return "";
    },
    rpnStatement() {
      return (
        "@ " +
        this.rpnDorMin +
        this.rpnGrRatio +
        " " +
        this.rpnGrRatioMath +
        this.rpnEirMin +
        this.rpnEirMinMath +
        this.rpnMin +
        " max " +
        this.rpnMax +
        " min " +
        this.rpnLeft +
        "(>K:" +
        this.rpnFindEvent +
        ")"
      );
    },
  },
  methods: {
    invertMinMax() {
      var max2 = this.eir_min;
      var min2 = this.eir_max;

      this.eir_max = max2;
      this.eir_min = min2;
    },
    copyCodeDesktop() {
      let codeToCopy = document.querySelector("#rpn_code");
      codeToCopy.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log(msg);
        this.$swal({
          position: "bottom-end",
          icon: "info",
          title: '<h4 style="color:#D2D0D2">Copied to clipboard</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 1000,
        });
      } catch (err) {
        alert("Oops, unable to copy");
      }
      window.getSelection().removeAllRanges();
    },
  },
  watch: {
    dor_selected: function () {
      for (let index = 0; index < this.dor_preset.length; index++) {
        const dor = this.dor_preset[index];
        if (dor.name == this.dor_selected) {
          this.dor_min = dor.min;
          this.dor_max = dor.max;
        }
      }
    },
    eir_selected: function () {
      for (let index = 0; index < this.eir_preset.length; index++) {
        const eir = this.eir_preset[index];
        if (eir.name == this.eir_selected) {
          this.eir_min = eir.min;
          this.eir_max = eir.max;
        }
      }
    },
  },
  setup() {
    const { toClipboard } = useClipboard();

    const copy = async () => {
      try {
        await toClipboard(this.rpnStatement);
        console.log("Copied to clipboard");
      } catch (e) {
        console.error(e);
      }
    };

    return {
      copy,
    };
  },
};
</script>

<style scoped>
.input-primary:focus {
  box-shadow: 0 0 0 0px hsl(var(--b1)), 0 0 0 0px hsl(var(--p));
}

.label-text {
  @apply text-base;
}
</style>