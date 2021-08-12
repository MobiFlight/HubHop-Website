<template>
  <div class="hidden md:flex items-center justify-center">
    <button
      type="button"
      @click="openModal"
      class="bg-hhOrange font px-2 py-1 max-w-xs font-semibold text-hhCard text-lg rounded"
    >
      Add event or variable
    </button>
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
                    Add an event or variable
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
              <div class="mt-2">
                <AddEvent />
              </div>
              <div class="flex justify-end">
                <!-- <button
                  type="button"
                  class="inline-flex justify-center px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  @click="closeModal"
                >
                  Close
                </button> -->
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import AddEvent from "../components/AddEvent.vue";
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
    AddEvent,
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
};
</script>
