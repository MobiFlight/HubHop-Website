<template>
  <div class="flex items-center justify-center">
    <button
      type="button"
      @click="openModal"
      class="bg-hhOrange font px-5 py-2 max-w-xs font-semibold text-hhCard text-lg rounded"
    >
      Add event or variable
    </button>
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal">
      <div class="fixed inset-0 z-10 overflow-y-auto">
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
              class="inline-block w-full max-w-7xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform border border-hhOrange bg-hhBG backdrop-filter backdrop-blur bg-opacity-50 shadow-xl rounded-lg"
            >
              <DialogTitle
                as="h3"
                class="text-2xl items-center leading-6 text-hhText"
              >
                Add an event or variable
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  <AddEvent />
                </p>
              </div>
              <div class="flex space-x-4 justify-end mt-4">
                <div>
                  <button
                    type="button"
                    class="inline-flex justify-center px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Add event / variable
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    class="inline-flex justify-center px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    @click="closeModal"
                  >
                    Close
                  </button>
                </div>
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
