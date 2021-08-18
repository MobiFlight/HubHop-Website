<template>
  <div class="hidden md:flex items-center justify-center">
    <div class="mt-2">
      <button
        @click="openModal"
        class="bg-hhOrange flex items-center px-2 py-1 shadow-lg rounded-lg text-hhBG font-bold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-1 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3"
          />
        </svg>
        Export list
      </button>
    </div>
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div">
      <div
        class="fixed inset-0 z-10 overflow-y-auto bg-hhBG bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-sm"
      >
        <div class="px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>

          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform border border-hhOrange bg-hhBG backdrop-filter backdrop-blur bg-opacity-90 shadow-xl rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div>
                  <DialogTitle
                    as="h3"
                    class="text-2xl items-center leading-6 text-hhText"
                  >
                  </DialogTitle>
                </div>
                <div>
                  <button type="button" @click="closeModal">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mt-3">
                <div class="grid grid-cols-4 align-top mt-3 gap-5">
                  <div
                    class="flex flex-col align-top items-center justify-center"
                  >
                    <h2 class="border-b-2 text-xl border-hhCard">Mobiflight</h2>
                    <div
                      class="flex flex-col align-top space-y-3 justify-center mt-3"
                    >
                      <button
                        class="flex items-center bg-hhOrange justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="exportEventsTxt"
                      >
                        <svg
                          v-if="eventsTxtDownload === true"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-hhBG"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        events.txt
                      </button>
                      <button
                        class="flex items-center bg-hhOrange justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="exportEventIds"
                      >
                        <svg
                          v-if="eventIdsCipDownload === true"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-hhBG"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        msfs2020_eventids.cip
                      </button>
                      <button
                        class="flex items-center bg-hhOrange justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="exportSimvars"
                      >
                        <svg
                          v-if="eventSimvarDownload === true"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-hhBG"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        msfs2020_simvars.cip
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <h2 class="border-b-2 text-xl border-hhCard">FSUIPC</h2>
                    <div class="flex flex-col space-y-3 justify-center mt-3">
                      <button
                        disabled
                        class="flex items-center bg-hhCard justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="closeModal"
                      >
                        mobiflight.evt
                      </button>
                      <div class="flex justify-center">Available soon</div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <h2 class="border-b-2 text-xl border-hhCard">SPAD.neXt</h2>
                    <div class="flex flex-col space-y-3 justify-center mt-3">
                      <button
                        disabled
                        class="flex items-center bg-hhCard justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="closeModal"
                      >
                        Configuration file (soon)
                      </button>
                      <div class="flex justify-center">Available soon</div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <h2 class="border-b-2 text-xl border-hhCard">
                      Axis and Ohs
                    </h2>
                    <div class="flex flex-col space-y-3 justify-center mt-3">
                      <button
                        disabled
                        class="flex items-center bg-hhCard justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg"
                        type="button"
                        @click="closeModal"
                      >
                        Configuration file
                      </button>
                      <div class="flex justify-center">Available soon</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  class="flex items-center bg-hhOrange justify-center text-hhBG px-2 py-1 rounded-lg shadow-lg mt-5"
                  type="button"
                  @click="closeModal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";

export default {
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
  },
  data() {
    return {
      eventsTxtDownload: false,
      eventIdsCipDownload: false,
      eventSimvarDownload: false,
    };
  },
  setup() {
    const isOpen = ref(false);

    return {
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      openModal() {
        isOpen.value = true;
      },
    };
  },
  methods: {
    exportEventsTxt() {
      this.eventsTxtDownload = true;
      fetch(this.$hubHopApi.baseUrl + "/export/presets")
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "events.txt";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.eventsTxtDownload = false;
        });
    },
    exportEventIds() {
      this.eventIdsCipDownload = true;
      fetch(this.$hubHopApi.baseUrl + "/export/presets?type=cip")
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "msfs2020_eventids.cip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.eventIdsCipDownload = false;
        });
    },
    exportSimvars() {
      this.eventSimvarDownload = true;
      fetch(this.$hubHopApi.baseUrl + "/export/presets?type=simvar")
        .then((response) => response.blob())
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "msfs2020_simvars.cip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.eventSimvarDownload = false;
        });
    },
  },
};
</script>
