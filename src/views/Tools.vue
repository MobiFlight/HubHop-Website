<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-3 gap-3 mx-5 text-sm md:text-base">
      <button
        @click="toggleJaime"
        class="
          bg-hhOrange
          text-hhBG
          flex
          items-center
          p-3
          font-bold
          rounded-box
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-at"
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
          <circle cx="12" cy="12" r="4"></circle>
          <path
            d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"
          ></path></svg
        >Jaime's Potentiometer RPN-Tool
      </button>
      <button
        @click="toggleJaime"
        class="
          bg-hhCard
          text-hhText
          flex
          items-center
          p-3
          font-bold
          rounded-box
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon mr-1 icon-tabler icon-tabler-replace"
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
          <rect x="3" y="3" width="6" height="6" rx="1"></rect>
          <rect x="15" y="15" width="6" height="6" rx="1"></rect>
          <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path>
          <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path></svg
        >Placeholder
      </button>
      <button
        disabled
        @click="toggleJaime"
        class="
          bg-hhCard
          text-hhText
          flex
          items-center
          p-3
          font-bold
          rounded-box
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon mr-1 icon-tabler icon-tabler-replace"
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
          <rect x="3" y="3" width="6" height="6" rx="1"></rect>
          <rect x="15" y="15" width="6" height="6" rx="1"></rect>
          <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path>
          <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path></svg
        >Placeholder
      </button>
    </div>
    <div>
      <transition name="fade">
        <JaimesPoti />
      </transition>
    </div>
  </div>
</template>

<script>
import JaimesPoti from "../components/JaimesPoti.vue";

export default {
  name: "Tools",
  data() {
    return {
      jaime: true,
    };
  },
  components: { JaimesPoti },
  methods: {
    toggleJaime() {
      this.jaime = !this.jaime;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>