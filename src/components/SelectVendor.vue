<template>
  <div class="">
    <Listbox v-model="selectedVendor">
      <div class="relative mt-1">
        <ListboxButton
          class="relative w-full py-2 pl-3 pr-10 text-left text-gray-200 bg-hhCard border border-hhOrange rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
        >
          <span class="block truncate">{{ selectedVendor.name }}</span>
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute w-full py-1 mt-1 overflow-auto text-base text-gray-400 bg-hhCard rounded-md shadow-lg max-h-60 ring-1 ring-hhOrange ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="vendor in vendor"
              :key="vendor.name"
              :value="vendor"
              :disabled="vendor.unavailable"
              as="template"
            >
              <li
                :class="[
                  active ? 'text-hhCard bg-hhOrange bg-opacity-50' : 'text-gray-400',
                  'cursor-default select-none relative py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'text-hhOrange font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ vendor.name }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },

  setup() {
    const vendor = [
      { name: "Select publisher / vendor", unavailable: true },
      { name: "Asobo" },
      { name: "Fly by Wire Simulations" },
      { name: "Aerosoft" },
      { name: "Working Title" },
      { name: "Some others" },
    ];
    const selectedVendor = ref(vendor[0]);

    return {
      vendor,
      selectedVendor,
    };
  },
};
</script>