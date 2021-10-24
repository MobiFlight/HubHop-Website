<template>
  <header class="min-h-screen">
    <div
      class="container flex justify-between mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
    >
      <div class="sm:text-center lg:text-left">
        <h1
          class="text-4xl tracking-tight font-extrabold text-hhOrange sm:text-5xl md:text-6xl"
        >
          <span class="block xl:inline">Create, Share, Improve</span>
        </h1>
        <div
          class="mt-5 mb-10 text-base text-hhText sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
        >
          HubHop is an API which consolidates Microsoft Flight Simulator 2020
          variables and events and provides unique, understandable and
          standardized events and variables.
        </div>
        <div
          class="text-2xl mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
        >
          <div class="rounded-md shadow">
            <router-link
              to="/list"
              class="w-full flex items-center justify-center px-8 py-3 font-bold rounded-lg shadow-lg bg-hhOrange text-hhBG hover:bg-orange-500 md:py-4 md:text-lg md:px-10"
            >
              <div class="text-2xl">
                View contributions
              </div>
            </router-link>
          </div>
        </div>
        <div
          class="text-2xl mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
        >
          <div class="text-lg">
            <a class="flex items-center" href="https://www.mobiflight.com" target="_blank">Created and sponsored by Mobiflight and the Mobiflight community<img class="ml-2 h-7" src="../assets/mf_logo.jpg" alt="Mobiflight Logo" /></a>
          </div>
        </div>
      </div>
      <div class="hidden lg:block">
        <img src="../assets/logo.png" alt="HubHop Logo" />
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Home",
};
</script>
