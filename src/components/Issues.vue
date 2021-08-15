<template>
  <div>
    <div class="bg-hhCard rounded-lg shadow-lg mb-3 py-3">
      <h3 class="flex items-center justify-center border-hhText mx-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-1 h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          /></svg
        >HubHop Issues
      </h3>
    </div>
    <div class="lg:flex lg:space-x-5">
      <div
        class="bg-hhCard flex lg:block justify-center mx-auto rounded-lg shadow-lg py-5 mb-5 lg:mb-0 w-full lg:w-1/6"
      >
        <div class="flex justify-center mt-3 mb-3 px-3">
          <button
            class="flex items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
          >
            <a
              class="flex flex-col lg:flex-row items-center"
              target="_blank"
              href="https://github.com/HubHopAPI/HubHop-Website/issues/new"
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
                  stroke-width="1.5"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <div class="text-xs sm:text-sm lg:text-sm">
                New Issue (external)
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="hidden lg:block h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </button>
        </div>
        <div class="flex justify-center mt-3 mb-3 px-3">
          <button
            @click="openIssuesShow()"
            class="flex flex-col lg:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
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
                stroke-width="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="text-xs sm:text-sm lg:text-sm">Open Issues</div>
          </button>
        </div>
        <div class="flex justify-center mt-3 mb-3 px-3">
          <button
            @click="closedIssuesShow()"
            class="flex flex-col lg:flex-row items-center bg-hhOrange text-hhBG font-bold shadow-lg rounded-lg px-2 py-1 w-full"
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
                stroke-width="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="text-xs sm:text-sm lg:text-sm">Closed Issues</div>
          </button>
        </div>
      </div>
      <div
        class="bg-hhCard rounded-lg shadow-lg py-5 mx-auto w-full px-3 lg:px-0 lg:w-5/6"
      >
        <transition name="fade" mode="out-in">
          <div v-if="openIssuesOpen" class="mb-5 text-base">
            <h3>Open Issues</h3>
            <div
              class="container w-auto lg:w-5/6 lg:1/2 mx-auto mt-5"
              v-if="openIssues.length"
            >
              <div
                class="flex justify-around"
                v-for="openIssues in openIssues"
                :key="openIssues.id"
              >
                <div
                  @click="openIssueOnGithub(openIssues.number)"
                  class="container cursor-pointer transition hover:bg-hhOrange hover:font-bold hover:text-hhBG hover:shadow-lg rounded-lg px-5 mx-auto flex text-left mt-5"
                >
                  {{ openIssues.title }}
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div v-if="closedIssuesOpen" class="mb-5 text-base">
            <h3>Closed Issues</h3>
            <div
              class="container w-auto lg:w-5/6 lg:1/2 mx-auto mt-5"
              v-if="closedIssues.length"
            >
              <div
                class="flex justify-around"
                v-for="closedIssues in closedIssues"
                :key="closedIssues.id"
              >
                <div
                  @click="openIssueOnGithub(closedIssues.number)"
                  class="container cursor-pointer transition hover:bg-hhOrange hover:font-bold hover:text-hhBG hover:shadow-lg rounded-lg px-5 mx-auto flex text-left mt-5"
                >
                  {{ closedIssues.title }}
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div
        class="container mx-auto"
        v-if="!closedIssues.length || !closedIssues.length"
      >
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Changelog",
  data() {
    return {
      closedIssues: [],
      openIssues: [],
      openIssuesOpen: true,
      closedIssuesOpen: false,
    };
  },
  methods: {
    openIssueOnGithub(number) {
      window.open(
        "https://github.com/HubHopAPI/HubHop-Website/issues/" + number
      );
    },
    openIssuesShow() {
      if (this.closedIssuesOpen) {
        setTimeout(() => {
          this.openIssuesOpen = true;
        }, 500);
        this.closedIssuesOpen = false;
      }
    },
    closedIssuesShow() {
      if (this.openIssuesOpen) {
        setTimeout(() => {
          this.closedIssuesOpen = true;
        }, 500);
        this.openIssuesOpen = false;
      }
    },
  },
  mounted() {
    fetch(
      "https://api.github.com/repos/HubHopAPI/HubHop-Website/issues?state=closed"
    )
      .then((res) => res.json())
      .then((closedIssues) => (this.closedIssues = closedIssues));
    fetch(
      "https://api.github.com/repos/HubHopAPI/HubHop-Website/issues?state=open"
    )
      .then((res) => res.json())
      .then((openIssues) => (this.openIssues = openIssues));
  },
};
</script>
