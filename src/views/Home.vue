<template>
  <header class="h-full">
    <div
      class="flex justify-between mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
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
              to="/add"
              class="w-full flex items-center justify-center px-8 py-3 font-bold rounded-lg shadow-lg bg-hhOrange text-hhBG hover:bg-orange-500 md:py-4 md:text-lg md:px-10"
            >
              <div class="text-2xl">
                Contribute
              </div>
            </router-link>
          </div>
          <div class="mt-3 sm:mt-0 sm:ml-3">
            <router-link
              to="/list"
              class="w-full flex items-center justify-center shadow-lg px-8 py-3 text-base rounded-lg text-hhText bg-hhCard hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
            >
              <div class="text-2xl">
                View list
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div>
        <img src="../assets/logo.png" alt="HubHop Logo" />
      </div>
    </div>
  </header>
  <div class="container mx-auto">
    <div>
      <div class="container mx-auto mb-10">
        <h1>Unique event/variable names</h1>
      </div>
      <div class="flex items-center justify-between">
        <div
          class=" p-10 max-w-1xl  border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <div class="mb-5">
            Complicated, „unreadable“ MSFS 2020 events and variables from many
            sources, using complicated Reverse Polish Notation (RPN).
          </div>
          <div>
            <p>Example:</p>
            <p
              class="bg-hhBG rounded border border-hhOrange font-mono text-sm p-5"
            >
              A320NX_LOC#(L:A32NX_AUTOPILOT_LOC_MODE, bool) if{ 0
              (>L:A32NX_AUTOPILOT_APPR_MODE) 0 (>L:A32NX_AUTOPILOT_LOC_MODE)
              (>K:AP_LOC_HOLD_ON) } els{ 0 (>L:A32NX_AUTOPILOT_APPR_MODE) 1
              (>L:A32NX_AUTOPILOT_LOC_MODE) (>K:AP_LOC_HOLD_ON) }
            </p>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class="flex flex-col items-center  pl-10 pr-10 pt-3 pb-3 border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <h1>
            HubHop
          </h1>
          <img class="w-20" src="../assets/logo.png" alt="HubHop Logo" />
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class="p-10 max-w-1xl min-w-max border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <div class="mb-5">
            „Easy to read“ MSFS 2020 events and variables for the community.
          </div>
          <div>
            <p>Example:</p>
            <p
              class="bg-hhBG rounded border border-hhOrange font-mono text-sm p-5"
            >
              A32NX.FCU_LOC_PUSH
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-20">
      <div class="container mx-auto mt-40 mb-10">
        <h1>Translate legacy variables and events</h1>
      </div>
      <div class="flex items-center justify-between">
        <div
          class=" p-10 max-w-1xl  border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <div class="mb-5">
            Hardly understandable names with unknown index and unit declaration.
          </div>
          <div>
            <p>Example:</p>
            <p
              class="bg-hhBG rounded border border-hhOrange font-mono text-sm p-5"
            >
              COM STANDBY FREQUENCY:index Frequency BCD16
            </p>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class="flex flex-col items-center  pl-10 pr-10 pt-3 pb-3 border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <h1>
            HubHop
          </h1>
          <img class="h-20" src="../assets/logo.png" alt="HubHop Logo" />
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class="p-10 max-w-1xl  border border-opacity-60 border-hhOrange rounded-lg bg-opacity-60 shadow-lg"
        >
          <div class="mb-5">
            Understandable, human-readable events/variables. Events/variables
            can be assigned to a specific author and a specific aircraft.
          </div>
          <div>
            <p>Use case 1:</p>
            <p
              class="bg-hhBG rounded border border-hhOrange font-mono text-sm p-5"
            >
              ASOBO.CESSNA172.RADIO.ACTIVE COM 1 FREQUENCY
            </p>
          </div>
          <div>
            <p>Use case 2:</p>
            <p
              class="bg-hhBG rounded border border-hhOrange font-mono text-sm p-5"
            >
              A32NX.A320.RADIO.ACTIVE COM 1 FREQUENCY
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
