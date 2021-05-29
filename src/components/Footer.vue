<template>
  <footer class="bg-hhBG text-base p-10 flex items-center justify-between">
    <div><span>&#169;</span> HubHop and its contributors 2021</div>
    <div class="flex items-center">
      <div class="mx-5">
        <button class="flex items-center justify-around">
          <a href="#" target="_blank"
            ><img
              class="max-h-8 mx-2"
              src="../assets/Discord-Logo-White.png"
              alt="Discord Logo"
            /> </a
          >Join us on Discord
        </button>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <button class="mt-1 mb-1 flex items-center justify-around">
        <a href="https://github.com/HubHopAPI/HubHop-Website" target="_blank">
          <img
            class="max-h-7 mx-2"
            src="../assets/GitHub-Mark-Light-32px.png"
            alt="GitHub"
          /> </a
        >Homepage Source Code
      </button>
      <div>
        <button class="mt-1 mb-1 flex items-center justify-around">
          <a href="#" target="_blank">
            <img
              class="max-h-7 mx-2"
              src="../assets/GitHub-Mark-Light-32px.png"
              alt="GitHub"
            />
          </a>
          API Source Code?!
        </button>
      </div>
      <div>
        <button class="mt-1 mb-1 flex items-center justify-around">
          <router-link
            @click="scrollTop"
            class="flex items-center justify-around"
            to="/terms"
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Terms of Service
          </router-link>
        </button>
      </div>
      <div>
        <button class="mt-1 mb-1 flex items-center justify-around">
          <router-link @click="scrollTop" class="flex items-center justify-around" to="/privacy">
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
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            Privacy Policy
          </router-link>
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  name: "Footer",
  methods: {
    scrollTop: function() {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId);
        }
        window.scroll(0, window.pageYOffset - 50);
      }, 20);
    },
    scrollListener: function() {
      this.visible = window.scrollY > 150;
    },
  },
  mounted: function() {
    window.addEventListener("scroll", this.scrollListener);
  },
  beforeUnmount: function() {
    window.removeEventListener("scroll", this.scrollListener);
  },
};
</script>
