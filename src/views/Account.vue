<template>
  <div
    class="
      container
      mb-5
      px-5
      mx-auto
      md:flex md:space-x-5
      min-h-screen
      -mt-10
      md:mt-5
    "
  >
    <div
      class="
        bg-hhCard
        flex flex-col
        md:block
        justify-center
        rounded-lg
        shadow-lg
        py-5
        mb-5
        md:mb-0
        w-full
        md:w-1/6
        text-xs
        md:text-base
      "
    >
      <h3 class="border-b border-hhText pb-3 mx-3">Menu</h3>
      <div class="flex justify-center mt-3 mb-3 px-3">
        <button
          @click="profileActive"
          class="
            flex
            justify-center
            md:flex-row
            items-center
            bg-hhOrange
            text-hhBG
            font-bold
            shadow-lg
            rounded-lg
            px-2
            py-1
            w-full
          "
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Your Profile
        </button>
      </div>
      <!-- <div class="flex justify-center px-3">
        <button
          @click="settingsActive"
          class="
            flex
            justify-center
            md:flex-row
            items-center
            bg-hhOrange
            text-hhBG
            font-bold
            shadow-lg
            rounded-lg
            px-2
            py-1
            w-full
          "
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Your Settings
        </button>
      </div> -->
    </div>
    <div class="mx-auto w-full md:px-0 md:w-5/6">
      <div class="container mx-auto">
        <transition name="fade" mode="out-in">
          <div v-if="profile" class="rounded-lg flex-1 space-y-3">
            <div class="bg-hhCard rounded-lg shadow-lg py-3">
              <h3 class="flex items-center justify-center border-hhText mx-6">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  /></svg
                >Your Profile
              </h3>
            </div>
            <div
              class="
                bg-hhCard
                grid grid-cols-2
                gap-2
                px-5
                py-3
                my-5
                rounded-lg
                shadow-lg
              "
            >
              <div class="bg-hhBG rounded-lg shadow-lg px-5">
                <div
                  class="
                    flex
                    items-center
                    text-sm
                    md:text-base
                    lg:text-2xl
                    py-2
                    justify-center
                    border-b border-hhOrange
                  "
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
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    /></svg
                  >Added or edited presets
                </div>
                <div class="grid grid-rows-3 my-3">
                  <div>To be added</div>
                </div>
              </div>
              <div class="bg-hhBG rounded-lg shadow-lg px-5">
                <div
                  class="
                    flex
                    items-center
                    text-sm
                    md:text-base
                    lg:text-2xl
                    py-2
                    justify-center
                    border-b border-hhOrange
                  "
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    /></svg
                  >Top 3 Aircraft
                </div>
                <div class="grid grid-rows-3 my-3">
                  <div>To be added</div>
                </div>
              </div>
            </div>
            <div class="bg-hhCard rounded-lg shadow-lg py-2 px-5 mb-3">
              <div
                class="
                  flex
                  items-center
                  justify-center
                  border-b-2 border-hhCard
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mb-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 class="ml-1 mb-2 border-hhCard">User information</h4>
              </div>
              <div class="items-center gap-5 my-5">
                <div class="space-y-5">
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <label
                      class="
                        bg-hhBG
                        w-full
                        text-hhText
                        p-2
                        text-left
                        rounded-lg
                        border border-hhOrange
                      "
                      type="text"
                      >{{ account.username }}</label
                    >
                  </div>
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <label
                      class="
                        bg-hhBG
                        w-full
                        text-hhText
                        p-2
                        text-left
                        rounded-lg
                        border border-hhOrange
                      "
                      type="text"
                      >{{ account.name }}</label
                    >
                  </div>
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <label
                      class="
                        bg-hhBG
                        w-full
                        text-hhText
                        p-2
                        text-left
                        rounded-lg
                        space-x-2
                        border border-hhOrange
                      "
                      type="text"
                    >
                      <label
                        class="
                          bg-blue-600
                          text-hhBG
                          font-bold
                          px-3
                          py-0.5
                          rounded-full
                        "
                        v-if="roles.includes('SuperAdmin')"
                        >Superadmin</label
                      >
                      <label
                        class="
                          bg-green-600
                          text-hhBG
                          font-bold
                          px-3
                          py-0.5
                          rounded-full
                        "
                        v-if="roles.includes('Moderator')"
                      >
                        Moderator
                      </label>
                      <label
                        class="
                          bg-hhOrange
                          text-hhBG
                          font-bold
                          px-3
                          py-0.5
                          rounded-full
                        "
                      >
                        User
                      </label></label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <!-- <transition name="fade" mode="out-in">
          <div v-if="settings" class="rounded-lg flex-1 space-y-3">
            <div class="bg-hhCard rounded-lg shadow-lg py-3">
              <h3 class="flex items-center justify-center border-hhText mx-6">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  /></svg
                >Your Settings
              </h3>
            </div>
            <div class="bg-hhCard rounded-lg shadow-lg py-2 px-5 mb-3">
              <div class="w-1/2">
                <div
                  data-tip="Toggles if HubHop will download the preset list automatically or manually"
                  class="tooltip"
                >
                  <div>Refresh cycle</div>
                </div>

                <div
                  class="bg-hhBG rounded-lg flex px-3 flex-col justify-center"
                >
                  <div class="flex items-center">
                    <input
                      v-model="refreshCycle"
                      class="mr-1"
                      value="dynamic"
                      type="radio"
                      name="refreshCycle"
                      id="dynamic"
                    />
                    <div
                      data-tip="Switches to dynamic mode. The preset list will be downloaded every time you enter the 'Preset list' page"
                      class="tooltip"
                    >
                      <label for="dynamic">Dynamic</label>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="refreshCycle"
                      class="mr-1"
                      value="manual"
                      type="radio"
                      name="refreshCycle"
                      id="manual"
                    />
                    <div
                      data-tip="Switches to manual mode. The preset list will be downloaded once you click the 'Download presets' button at the bottom of the 'Preset list' page"
                      class="tooltip"
                    >
                      <label for="manual">Manual</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition> -->
      </div>
    </div>
  </div>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";

export default {
  Name: "Add",
  data() {
    return {
      profile: true,
      settings: false,
      account: undefined,
      refreshCycle: this.$store.state.refreshCycle,
      roles: this.$store.state.userSettings.roles,
      view: {
        topOfPage: true,
      },
    };
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
    const myAccounts = this.$msalInstance.getAllAccounts();
    this.account = myAccounts[0];
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  watch: {
    refreshCycle: function () {
      this.$store.commit("setRefreshCycle", this.refreshCycle);
    },
  },
  methods: {
    profileActive() {
      if (this.settings) {
        setTimeout(() => {
          this.profile = true;
        }, 500);
        this.settings = false;
      }
    },
    settingsActive() {
      if (this.profile) {
        setTimeout(() => {
          this.settings = true;
        }, 500);
        this.profile = false;
      }
    },
  },
};
</script>
