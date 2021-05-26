<template>
  <div
    :class="{ onScroll: !view.topOfPage }"
    class="nav fixed top-0 left-0 right-0"
  >
    <div class="px-52 mx-auto px-page">
      <div class="flex justify-between">
        <div>
          <router-link @click="scrollTop" to="/"
            ><img class="max-h-20" src="@/assets/logo-big.png" alt=""
          /></router-link>
        </div>
        <div class="flex items-center text-2xl">
          <router-link @click="scrollTop" class="px-5" to="/">Home</router-link>
          <router-link @click="scrollTop" class="px-5" to="/add"
            >Add event</router-link
          >
          <router-link @click="scrollTop" class="px-5" to="/list"
            >Events/Variables</router-link
          >
          <!-- <router-link @click="scrollTop" class="px-5" to="/api"
            >The API</router-link
          > -->
          <!-- <router-link @click="scrollTop" class="px-5" to="/team"
            >The Team</router-link
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      view: {
        topOfPage: true,
      },
    };
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.pageYOffset > 0) {
        if (this.view.topOfPage) this.view.topOfPage = false;
      } else {
        if (!this.view.topOfPage) this.view.topOfPage = true;
      }
    },
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
    mounted: function() {
      window.addEventListener("scroll", this.scrollListener);
    },
    beforeUnmount: function() {
      window.removeEventListener("scroll", this.scrollListener);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  transition: all 0.2s ease-in-out;
  &.onScroll {
    box-shadow: 0 0 10px #33353e;
    background-color: #33353e;
  }
  a {
    &.router-link-exact-active {
      color: #ffa047;
    }
  }
}
</style>
