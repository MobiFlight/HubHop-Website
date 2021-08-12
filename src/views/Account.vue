<template>
  <!-- Mobile View -->
  <div class="-mt-10 block md:hidden container mx-auto">
    <div class="px-2 container mx-auto gap-20">
      <div class="bg-hhBG shadow-lg rounded-lg px-10 h-32">
        <div class="text-2xl border-b-2 border-hhCard">
          Hi, {{ account.name }}
        </div>
        <div>
          <button
            class="px-4 my-2 flex items-center w-full"
            @click="profileActive"
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
        <div>
          <button
            class="px-4 my-2 flex items-center w-full"
            @click="settingsActive"
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
        </div>
      </div>
      <div class="container mx-auto mt-5 px-2">
        <div v-if="profile" class="rounded-lg flex-1">
          <div class="flex items-center justify-center">
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
            <h3>Your Profile</h3>
          </div>
          <div class="mt-5 grid grid-cols-3 gap-2 my-5">
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                  />
                </svg>
                <h4>
                  Added or edited presets
                </h4>
              </div>
              <p>To be added</p>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                  />
                </svg>
                <h4>
                  Top 3 Aircraft
                </h4>
              </div>
              <p>To be added</p>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <h4>Rank</h4>
              </div>
              <p>To be added</p>
            </div>
          </div>
          <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5 mb-5">
            <div
              class="flex items-center justify-center border-b-2 border-hhCard"
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
              <h4 class="ml-1 mb-2 border-hhCard">
                User information
              </h4>
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
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg border border-hhOrange"
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
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg border border-hhOrange"
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
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg space-x-2 border border-hhOrange"
                    type="text"
                  >
                    <label
                      class="bg-blue-600 text-hhBG font-bold px-3 py-0.5 rounded-full"
                      v-if="roles.includes('SuperAdmin')"
                      >Superadmin</label
                    >
                    <label
                      class="bg-green-600 text-hhBG font-bold px-3 py-0.5 rounded-full"
                      v-if="roles.includes('Moderator')"
                    >
                      Moderator
                    </label>
                    <label
                      class="bg-hhOrange text-hhBG font-bold px-3 py-0.5 rounded-full"
                    >
                      User
                    </label></label
                  >
                </div>
              </div>
              <div class="space-y-5 w-full">
                <div class="flex"></div>
                <div class="flex"></div>
                <div class="flex"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="settings" class="rounded-lg px-10 flex-1">
          <div class="flex items-center justify-center">
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
            <h3>
              Your Settings
            </h3>
          </div>
          <div class="mt-5 my-5">
            <p>To be added</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Desktop View -->
  <div class="hidden md:block h-screen container mx-auto">
    <div class="flex gap-20">
      <div class="bg-hhBG shadow-lg rounded-lg px-10 h-32">
        <div class="text-2xl border-b-2 border-hhCard">
          Hi, {{ account.name }}
        </div>
        <div>
          <button
            class="px-4 my-2 flex items-center w-full"
            @click="profileActive"
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
        <div>
          <button
            class="px-4 my-2 flex items-center w-full"
            @click="settingsActive"
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
        </div>
      </div>
      <div class="flex flex-1">
        <div v-if="profile" class="rounded-lg px-10 flex-1">
          <div class="flex items-center justify-center">
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
            <h3>Your Profile</h3>
          </div>
          <div class="mt-5 grid grid-cols-3 gap-20 my-5">
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                  />
                </svg>
                <h4>
                  Added or edited presets
                </h4>
              </div>
              <p>To be added</p>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                  />
                </svg>
                <h4>
                  Top 3 Aircraft
                </h4>
              </div>
              <p>To be added</p>
            </div>
            <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5">
              <div
                class="flex justify-center items-center border-b-2 border-hhCard mb-3"
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <h4>Rank</h4>
              </div>
              <p>To be added</p>
            </div>
          </div>
          <div class="bg-hhBG rounded-lg shadow-lg py-2 px-5 mb-5">
            <div
              class="flex items-center justify-center border-b-2 border-hhCard"
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
              <h4 class="ml-1 mb-2 border-hhCard">
                User information
              </h4>
            </div>
            <div class="flex items-center gap-5 my-5">
              <div class="w-1/4 space-y-5">
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
                  <label class="mr-2 text-lg">E-Mail</label>
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
                  <label class="mr-2 text-lg">Username</label>
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
                  <label class="mr-2 text-lg">Roles</label>
                </div>
              </div>
              <div class="space-y-5 w-full">
                <div class="flex">
                  <label
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg border border-hhOrange"
                    type="text"
                    >{{ account.username }}</label
                  >
                </div>
                <div class="flex">
                  <label
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg border border-hhOrange"
                    type="text"
                    >{{ account.name }}</label
                  >
                </div>
                <div class="flex">
                  <label
                    class="bg-hhBG w-full text-hhText p-2 text-left rounded-lg space-x-2 border border-hhOrange"
                    type="text"
                  >
                    <label
                      class="bg-blue-600 text-hhBG font-bold px-3 py-0.5 rounded-full"
                      v-if="roles.includes('SuperAdmin')"
                      >Superadmin</label
                    >
                    <label
                      class="bg-green-600 text-hhBG font-bold px-3 py-0.5 rounded-full"
                      v-if="roles.includes('Moderator')"
                    >
                      Moderator
                    </label>
                    <label
                      class="bg-hhOrange text-hhBG font-bold px-3 py-0.5 rounded-full"
                    >
                      User
                    </label></label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="settings" class="rounded-lg px-10 flex-1">
          <div class="flex items-center justify-center">
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
            <h3>
              Your Settings
            </h3>
          </div>
          <div class="mt-5 my-5">
            <p>To be added</p>
          </div>
        </div>
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
  methods: {
    profileActive() {
      this.profile = true;
      this.settings = false;
    },
    settingsActive() {
      this.profile = false;
      this.settings = true;
    },
  },
};
</script>
