<template>
  <div>
    <div class="min-h-screen text-lg p-5 mb-3 container mx-auto" v-if="preset">
      <!-- Mobile View -->
      <!-- View -->
      <div class="flex flex-col md:hidden justify-between -mt-10" v-if="!edit">
        <div class="space-y-5">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.vendor }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.aircraft }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
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
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.system }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.presetType }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.status }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div
              v-if="preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ formatDate(preset.createdDate) }}
            </div>
            <div
              v-if="!preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Initial import
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.author }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Version: {{ preset.version }}
            </div>
          </div>
          <div v-if="preset.updatedBy" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Updated by: {{ preset.updatedBy }}
            </div>
          </div>
          <div v-if="preset.reported" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Reported: {{ preset.reported }} Times
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            <div
              class="flex bg-hhBG text-hhText justify-around text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              <div v-if="preset.score">Score: {{ preset.score + score }}</div>
              <div v-else>Score: {{ 0 + score }}</div>
              <div>
                <button @click="upvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    /></svg
                  >Upvote
                </button>
              </div>
              <div>
                <button @click="downvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    /></svg
                  >Downvote
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 w-full">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.label }}
            </div>
          </div>
          <div class="flex mt-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <textarea
              id="preset-Code"
              v-model="preset.code"
              rows="4"
              class="bg-hhBG text-hhText font-mono text-start p-1 w-full break-normal rounded-lg border border-hhOrange"
            />
          </div>
          <div class="flex mt-1 flex-col items-end">
            <button
              class="bg-hhOrange flex items-center text-hhBG font-bold text-sm px-2 rounded-lg"
              @click="copyCode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                /></svg
              >Copy
            </button>
          </div>
          <div class="flex mt-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <textarea
              disabled
              rows="4"
              class="bg-hhBG text-hhText text-start p-1 w-full rounded-lg border border-hhOrange"
              v-if="preset.description"
              v-model="preset.description"
            />
            <div
              v-if="!preset.description"
              class="bg-hhBG text-hhText p-1 w-full flex place-content-center items-center rounded-lg border border-hhOrange"
            >
              No description available
            </div>
          </div>
          <div class="flex mt-3 justify-end">
            <button
              ref="btnRef"
              class="disabled:opacity-75 disabled:cursor-not-allowed flex items-center text-base px-2 text-hhText border-hhOrange rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              @click="openReport = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Report preset
            </button>
          </div>
        </div>
      </div>
      <!-- Edit -->
      <div class="flex flex-col md:hidden justify-between -mt-10" v-if="edit">
        <div class="space-y-5">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.vendor"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.aircraft"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
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
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.system"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.presetType"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <input
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.status"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              v-if="preset.createdDate"
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.createdDate"
            />
            <div
              v-if="!preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Initial import
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.author"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              Version: {{ preset.version }}
            </div>
          </div>
          <div v-if="preset.updatedBy" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Updated by: {{ preset.updatedBy }}
            </div>
          </div>
          <div v-if="preset.reported" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Reported: {{ preset.reported }} Times
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            <div
              class="flex bg-hhBG text-hhText justify-around text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              <div v-if="preset.score">Score: {{ preset.score + score }}</div>
              <div v-else>Score: {{ 0 + score }}</div>
              <div>
                <button @click="upvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    /></svg
                  >Upvote
                </button>
              </div>
              <div>
                <button @click="downvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    /></svg
                  >Downvote
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full">
          <div class="flex items-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.label"
            />
          </div>
          <div class="flex mt-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <textarea
              v-model="preset.code"
              id="preset-Code"
              rows="4"
              class="bg-hhCard text-hhText font-mono text-start p-1 w-full break-normal rounded-lg border border-hhOrange"
            />
          </div>
          <div class="flex mt-1 flex-col items-end">
            <button
              class="bg-hhOrange flex items-center text-hhBG font-bold text-sm px-2 rounded-lg"
              @click="copyCode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                /></svg
              >Copy
            </button>
          </div>
          <div class="flex mt-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <textarea
              rows="4"
              class="bg-hhCard text-hhText text-start p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.description"
            />
          </div>
          <div class="flex mt-3 justify-end">
            <button
              ref="btnRef"
              class="disabled:opacity-75 disabled:cursor-not-allowed flex items-center text-base px-2 text-hhText border-hhOrange rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              @click="openReport = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Report preset
            </button>
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class="md:hidden flex items-center justify-between mt-5">
        <div>
          <label for="toogleEdit" class="flex items-center cursor-pointer">
            <div class="mr-3 text-xl font-bold text-hhOrange" v-if="!edit">
              View
            </div>
            <div class="mr-3 text-xl" v-else>
              View
            </div>
            <div class="flex items-center">
              <!-- toggle -->
              <div class="relative">
                <!-- input -->
                <input
                  id="toogleEdit"
                  type="checkbox"
                  class="sr-only"
                  v-model="edit"
                />
                <!-- line -->
                <div
                  class="w-14 h-6 bg-gray-400 rounded-full shadow-inner"
                ></div>
                <!-- dot -->
                <div
                  class="dot absolute w-8 h-8 bg-hhCard rounded-full shadow -left-1 -top-1 transition"
                ></div>
              </div>
              <!-- label -->
              <div class="ml-3 text-xl font-bold text-hhOrange" v-if="edit">
                Edit
              </div>
              <div class="ml-3 text-xl" v-else>
                Edit
              </div>
            </div>
            <div></div>
          </label>
        </div>
        <div>
          <button
            class="text-xl px-2 py-1 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            @click="goBackCheck"
          >
            Back
          </button>
        </div>
      </div>
      <div class="md:hidden flex justify-end mt-5">
        <button
          class=" justify-end text-xl px-2 py-1 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          @click="updatePreset(preset.id)"
          v-if="edit"
        >
          Save changes
        </button>
      </div>
      <div class="md:hidden flex justify-end mt-5">
        <button
          style="background-color: #A4031F"
          class=" justify-end text-xl px-2 py-1 font-bold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          v-if="roles.includes('Moderator')"
          @click="openDelete = true"
        >
          Delete
        </button>
      </div>
      <div
        class="flex justify-between flex-col md:hidden mt-5 space-y-5 items-center"
      >
        <div class="flex items-center justify-between">
          <div></div>
          <div></div>
        </div>
        <div class="flex justify-between"></div>
        <div class="flex items-center justify-center">
          <div
            ref="tooltipRef"
            v-bind:class="{ hidden: !tooltipShow, block: tooltipShow }"
            class="bg-hhBG border border-hhOrange text-hhText block z-50 font-normal leading-normal text-sm max-w-sm text-left no-underline break-words rounded-lg"
          >
            <div>
              <div
                class="bg-hhBG text-hhText opacity-75 font-semibold p-3 border-b border-solid border-hhOrange uppercase rounded-t-lg"
              >
                Report preset
              </div>
              <div class="text-white p-3">
                Report it if this preset is not functional or misleading.
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Desktop View -->
      <!-- View -->
      <div class="hidden md:flex justify-between space-x-20" v-if="!edit">
        <div class="w-1/3 space-y-5">
          <div class="flex text-transparent -mt-2 items-start">ph</div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.vendor }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.aircraft }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
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
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.system }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.presetType }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.status }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div
              v-if="preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ formatDate(preset.createdDate) }}
            </div>
            <div
              v-if="!preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Initial import
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              {{ preset.author }}
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Version: {{ preset.version }}
            </div>
          </div>
          <div v-if="preset.updatedBy" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Updated by: {{ preset.updatedBy }}
            </div>
          </div>
          <div v-if="preset.reported" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Reported: {{ preset.reported }} Times
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            <div
              class="flex bg-hhBG text-hhText justify-around text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              <div v-if="preset.score">Score: {{ preset.score + score }}</div>
              <div v-else>Score: {{ 0 + score }}</div>
              <div>
                <button @click="upvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    /></svg
                  >Upvote
                </button>
              </div>
              <div>
                <button @click="downvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    /></svg
                  >Downvote
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              v-on:mouseenter="toggleTooltip()"
              v-on:mouseleave="toggleTooltip()"
              ref="btnRef"
              class="disabled:opacity-75 disabled:cursor-not-allowed flex items-center text-base px-2 text-hhText border-hhOrange rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              @click="openReport = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Report preset
            </button>
          </div>
        </div>
        <div class="w-full">
          <div class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preset Name
          </div>
          <div
            class="bg-hhBG text-hhText p-1 mt-2 w-full rounded-lg border border-hhOrange"
          >
            {{ preset.label }}
          </div>
          <div class="flex items-center justify-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Code
          </div>
          <textarea
            id="preset-Code"
            v-model="preset.code"
            rows="4"
            class="bg-hhBG text-hhText font-mono text-start mt-2 p-1 w-full break-normal rounded-lg border border-hhOrange"
          />
          <div class="flex flex-col items-end">
            <button
              class="bg-hhOrange flex items-center text-hhBG font-bold text-sm px-2 rounded-lg"
              @click="copyCode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                /></svg
              >Copy
            </button>
          </div>
          <div class="flex items-center justify-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Description
          </div>
          <textarea
            disabled
            rows="4"
            class="bg-hhBG text-hhText text-start mt-2 p-1 w-full rounded-lg border border-hhOrange"
            v-if="preset.description"
            v-model="preset.description"
          />
          <div
            v-if="!preset.description"
            class="bg-hhBG text-hhText p-1 mt-2 w-full flex place-content-center items-center rounded-lg border border-hhOrange"
          >
            No description available
          </div>
        </div>
      </div>
      <!-- Edit -->
      <div class="hidden md:flex justify-between space-x-20" v-if="edit">
        <div class="w-1/3 space-y-5">
          <div class="flex text-transparent -mt-2 items-start">ph</div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.vendor"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.aircraft"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
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
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.system"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.presetType"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <input
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.status"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              v-if="preset.createdDate"
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.createdDate"
            />
            <div
              v-if="!preset.createdDate"
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Initial import
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              class="bg-hhCard text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
              v-model="preset.author"
            />
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              Version: {{ preset.version }}
            </div>
          </div>
          <div v-if="preset.updatedBy" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Updated by: {{ preset.updatedBy }}
            </div>
          </div>
          <div v-if="preset.reported" class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <div
              class="bg-hhBG text-hhText p-1 w-full rounded-lg border border-hhOrange"
            >
              Reported: {{ preset.reported }} Times
            </div>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            <div
              class="flex bg-hhBG text-hhText justify-around text-center p-1 w-full rounded-lg border border-hhOrange"
            >
              <div v-if="preset.score">Score: {{ preset.score + score }}</div>
              <div v-else>Score: {{ 0 + score }}</div>
              <div>
                <button @click="upvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    /></svg
                  >Upvote
                </button>
              </div>
              <div>
                <button @click="downvotePreset(id)" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    /></svg
                  >Downvote
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button
              v-on:mouseenter="toggleTooltip()"
              v-on:mouseleave="toggleTooltip()"
              ref="btnRef"
              class="disabled:opacity-75 disabled:cursor-not-allowed flex items-center text-base px-2 text-hhText border-hhOrange rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              @click="openReport = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              Report preset
            </button>
          </div>
        </div>
        <div class="w-full">
          <div class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preset Name
          </div>
          <input
            class="bg-hhCard text-hhText text-center mt-2 p-1 w-full rounded-lg border border-hhOrange"
            v-model="preset.label"
          />
          <div class="flex items-center justify-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Code
          </div>
          <textarea
            v-model="preset.code"
            id="preset-Code"
            rows="4"
            class="bg-hhCard text-hhText font-mono text-start mt-2 p-1 w-full break-normal rounded-lg border border-hhOrange"
          />
          <div class="flex flex-col items-end">
            <button
              class="bg-hhOrange flex items-center text-hhBG font-bold text-sm px-2 rounded-lg"
              @click="copyCode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                /></svg
              >Copy
            </button>
          </div>
          <div class="flex items-center justify-center mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-hhText mr-2 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Description
          </div>
          <textarea
            rows="4"
            class="bg-hhCard text-hhText text-start mt-2 p-1 w-full rounded-lg border border-hhOrange"
            v-model="preset.description"
          />
        </div>
      </div>
      <!-- Buttons -->
      <div class="hidden md:flex mt-5 justify-between items-center">
        <div class="flex space-x-5">
          <button
            style="background-color: #A4031F"
            class="text-xl ml-5 px-4 py-2 font-bold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            v-if="roles.includes('Moderator')"
            @click="openDelete = true"
          >
            Delete
          </button>
          <label for="toogleEdit" class="flex items-center cursor-pointer">
            <div class="mr-3 text-xl font-bold text-hhOrange" v-if="!edit">
              View
            </div>
            <div class="mr-3 text-xl" v-else>
              View
            </div>
            <div class="flex items-center">
              <!-- toggle -->
              <div class="relative">
                <!-- input -->
                <input
                  id="toogleEdit"
                  type="checkbox"
                  class="sr-only"
                  v-model="edit"
                />
                <!-- line -->
                <div
                  class="w-14 h-6 bg-gray-400 rounded-full shadow-inner"
                ></div>
                <!-- dot -->
                <div
                  class="dot absolute w-8 h-8 bg-hhCard rounded-full shadow -left-1 -top-1 transition"
                ></div>
              </div>
              <!-- label -->
              <div class="ml-3 text-xl font-bold text-hhOrange" v-if="edit">
                Edit
              </div>
              <div class="ml-3 text-xl" v-else>
                Edit
              </div>
            </div>
            <div></div>
          </label>
        </div>
        <div class="flex items-center justify-center">
          <div
            ref="tooltipRef"
            v-bind:class="{ hidden: !tooltipShow, block: tooltipShow }"
            class="bg-hhBG border border-hhOrange text-hhText block z-50 font-normal leading-normal text-sm max-w-sm text-left no-underline break-words rounded-lg"
          >
            <div>
              <div
                class="bg-hhBG text-hhText opacity-75 font-semibold p-3 border-b border-solid border-hhOrange uppercase rounded-t-lg"
              >
                Report preset
              </div>
              <div class="text-white p-3">
                Report it if this preset is not functional or misleading.
              </div>
            </div>
          </div>
          <TransitionRoot as="confirmReport" :show="openReport">
            <Dialog
              as="div"
              static
              class="fixed z-10 inset-0 overflow-y-auto"
              @close="openReport = false"
              :openReport="openReport"
            >
              <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
              >
                <TransitionChild
                  as="confirmReport"
                  enter="ease-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <DialogOverlay
                    class="fixed inset-0 bg-hhBG bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-sm"
                  />
                </TransitionChild>

                <span
                  class="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                  >&#8203;</span
                >
                <TransitionChild
                  as="confirmReport"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 translate-y-0 sm:scale-100"
                  leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div
                    class="inline-block align-bottom bg-hhText rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  >
                    <div class="bg-hhText px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div class="sm:flex sm:items-start">
                        <div
                          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationIcon
                            class="h-6 w-6 mr-1 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                        >
                          <DialogTitle
                            as="h3"
                            class="text-lg leading-6 font-medium text-gray-900"
                          >
                            Report preset
                          </DialogTitle>
                          <form class="flex flex-col text-hhBG mt-3 space-y-3">
                            <div class="flex">
                              <label>Pick report category</label>
                              <select
                                v-model="reportCategory"
                                required
                                class="bg-hhCard text-hhText px-2 py-1 w-full rounded-lg border border-hhOrange"
                              >
                                <option disabled selected value=""
                                  >Pick an option</option
                                >
                                <option>Not working since sim update</option>
                                <option>Bad code</option>
                                <option>Misleading</option>
                                <option>Duplicate</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <span
                              class="text-red-500"
                              v-if="v$.reportCategory.$error"
                            >
                              Pick a category
                              <!-- {{ v$.description.$errors[0].$message }} -->
                            </span>
                            <div class="flex flex-col">
                              <label>Describe your report</label>
                              <textarea
                                class="break-words text-hhText bg-hhCard p-3 rounded-lg border border-hhOrange"
                                cols="30"
                                rows="5"
                                v-model="reportDescription"
                              ></textarea>
                            </div>
                            <span
                              class="text-red-500"
                              v-if="v$.reportDescription.$error"
                            >
                              Description required
                              <!-- {{ v$.description.$errors[0].$message }} -->
                            </span>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div
                      class="bg-hhText px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                    >
                      <button
                        type="button"
                        class="disabled:opacity-25 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="reportPreset(id)"
                        :disabled="reportPresetClicked === true"
                      >
                        <svg
                          v-if="reportPresetClicked === true"
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Report
                      </button>
                      <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="openReport = false"
                        ref="cancelButtonRef"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </TransitionChild>
              </div>
            </Dialog>
          </TransitionRoot>

          <button
            class="text-xl ml-3 px-4 py-2 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            @click="updatePreset(preset.id)"
            v-if="edit"
          >
            Save changes
          </button>
          <button
            class="text-xl px-4 py-2 font-bold text-hhCard bg-hhOrange rounded-md ml-2 hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            @click="goBackCheck"
          >
            Back
          </button>
          <TransitionRoot as="confirmDelete" :show="openDelete">
            <Dialog
              as="div"
              static
              class="fixed z-10 inset-0 overflow-y-auto"
              @close="openDelete = false"
              :openDelete="openDelete"
            >
              <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
              >
                <TransitionChild
                  as="confirmDelete"
                  enter="ease-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <DialogOverlay
                    class="fixed inset-0 bg-hhBG bg-opacity-50 transition-opacity backdrop-filter backdrop-blur-sm"
                  />
                </TransitionChild>

                <!-- This element is to trick the browser into centering the modal contents. -->
                <span
                  class="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                  >&#8203;</span
                >
                <TransitionChild
                  as="confirmDelete"
                  enter="ease-out duration-300"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leave-from="opacity-100 translate-y-0 sm:scale-100"
                  leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div
                    class="inline-block align-bottom bg-hhText rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  >
                    <div class="bg-hhText px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div class="sm:flex sm:items-start">
                        <div
                          class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationIcon
                            class="h-6 w-6 mr-1 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                        >
                          <DialogTitle
                            as="h3"
                            class="text-lg leading-6 font-medium text-gray-900"
                          >
                            Delete preset
                          </DialogTitle>
                          <div class="mt-2">
                            <p class="text-gray-500">
                              Are you sure you want to delete this preset?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="bg-hhText px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                    >
                      <button
                        type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="deletePreset(preset.id)"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="openDelete = false"
                        ref="cancelButtonRef"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </TransitionChild>
              </div>
            </Dialog>
          </TransitionRoot>
        </div>
      </div>
    </div>
    <div v-if="!presetNotFound & !preset">
      <div class="spinner h-full"></div>
    </div>
    <div v-if="presetNotFound && !preset">
      <div class="h-full">
        <div class="flex flex-col mt-10 justify-center items-center">
          <h1>This preset does not exist or has been deleted</h1>
          <button
            class="text-xl px-2 py-1 mt-5 font-bold text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            @click="goBackCheck"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";
import { ref } from "vue";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationIcon } from "@heroicons/vue/outline";
import { createPopper } from "@popperjs/core";
import useClipboard from "vue-clipboard3";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  props: ["id"],
  validations: {
    reportCategory: { required },
    reportDescription: { required },
  },
  data() {
    return {
      preset: null,
      edit: false,
      roles: this.$store.state.userSettings.roles,
      reportPresetClicked: undefined,
      tooltipShow: false,
      score: "",
      reportCategory: "",
      reportDescription: "",
      presetNotFound: false,
    };
  },
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationIcon,
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.$store.state.msalConfig
    );
  },
  methods: {
    goBackCheck() {
      if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.$router.replace("/list");
      }
    },
    copyCode() {
      let codeToCopy = document.querySelector("#preset-Code");
      codeToCopy.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log(msg);
        this.$swal({
          position: "bottom-end",
          icon: "info",
          title: '<h4 style="color:#D2D0D2">Copied to clipboard</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 1000,
        });
      } catch (err) {
        alert("Oops, unable to copy");
      }
      window.getSelection().removeAllRanges();
    },
    deletePreset(id, onSuccessReload) {
      fetch(this.$hubHopApi.baseUrl + "/presets/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      }).then((res) => {
        if (res.status != 200) return;
        this.$swal({
          position: "center",
          icon: "success",
          title:
            '<h4 style="color:#D2D0D2">Your event/variable has been removed</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 2000,
          willClose: () => {
            if (onSuccessReload) location.reload();
            this.$router.go(-1);
          },
        });
      });
    },
    reportPresetClick() {
      this.reportPresetClicked === true;
    },
    upvotePreset(id) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      const url = this.$hubHopApi.baseUrl + "/presets/" + id;
      this.score++;

      let scoreNumber = {
        path:
          this.preset.vendor +
          "." +
          this.preset.aircraft +
          "." +
          this.preset.system +
          "." +
          this.preset.label,
        vendor: this.preset.vendor,
        aircraft: this.preset.aircraft,
        system: this.preset.system,
        code: this.preset.code,
        label: this.preset.label,
        tags: this.preset.tags,
        presetType: this.preset.presetType,
        version: this.preset.version,
        status: "Updated",
        createdDate: new Date().toUTCString(),
        author: this.preset.author,
        updatedBy: this.$store.state.userSettings.username,
        description: this.preset.description,
        reported: this.preset.reported + 0,
        score: this.score,
      };

      if (this.preset.score) {
        scoreNumber = {
          path:
            this.preset.vendor +
            "." +
            this.preset.aircraft +
            "." +
            this.preset.system +
            "." +
            this.preset.label,
          vendor: this.preset.vendor,
          aircraft: this.preset.aircraft,
          system: this.preset.system,
          code: this.preset.code,
          label: this.preset.label,
          tags: this.preset.tags,
          presetType: this.preset.presetType,
          version: this.preset.version,
          status: "Updated",
          createdDate: new Date().toUTCString(),
          author: this.preset.author,
          updatedBy: this.$store.state.userSettings.username,
          description: this.preset.description,
          reported: this.preset.reported + 0,
          score: this.preset.score + this.score,
        };
      }
      const preset = scoreNumber;

      // post body data
      const options = {
        method: "PUT",
        body: JSON.stringify(preset),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      };
      // send POST request
      fetch(url, options).then((res) => {
        console.log(res);
        if (res.status != 201) return;
        this.$swal({
          position: "bottom-end",
          icon: "success",
          title: '<h4 style="color:#D2D0D2">Upvote successful</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 1000,
        });
      });
    },
    downvotePreset(id) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      const url = this.$hubHopApi.baseUrl + "/presets/" + id;
      this.score--;

      // post body data
      const preset = {
        path:
          this.preset.vendor +
          "." +
          this.preset.aircraft +
          "." +
          this.preset.system +
          "." +
          this.preset.label,
        vendor: this.preset.vendor,
        aircraft: this.preset.aircraft,
        system: this.preset.system,
        code: this.preset.code,
        label: this.preset.label,
        tags: this.preset.tags,
        presetType: this.preset.presetType,
        version: this.preset.version,
        status: "Updated",
        createdDate: new Date().toUTCString(),
        author: this.preset.author,
        updatedBy: this.$store.state.userSettings.username,
        description: this.preset.description,
        reported: this.preset.reported + 0,
        score: this.preset.score + this.score,
      };
      const options = {
        method: "PUT",
        body: JSON.stringify(preset),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      };
      // send POST request
      fetch(url, options).then((res) => {
        console.log(res);
        if (res.status != 201) return;
        this.$swal({
          position: "bottom-end",
          icon: "success",
          title: '<h4 style="color:#D2D0D2">Downvote successful</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 1000,
        });
      });
    },

    reportPreset(id) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      this.v$.$validate();
      if (!this.v$.$error) {
        const url = this.$hubHopApi.baseUrl + "/presets/" + id;
        this.reportPresetClicked = true;

        // post body data
        const preset = {
          path:
            this.preset.vendor +
            "." +
            this.preset.aircraft +
            "." +
            this.preset.system +
            "." +
            this.preset.label,
          vendor: this.preset.vendor,
          aircraft: this.preset.aircraft,
          system: this.preset.system,
          code: this.preset.code,
          label: this.preset.label,
          tags: this.preset.tags,
          presetType: this.preset.presetType,
          version: this.preset.version,
          status: "Updated",
          createdDate: new Date().toUTCString(),
          author: this.preset.author,
          updatedBy: this.$store.state.userSettings.username,
          description: this.preset.description,
          score: this.preset.score + 0,
          reported: this.preset.reported + 1,
          report_catergory: this.reportCategory,
          report_description: this.reportDescription,
        };

        const options = {
          method: "PUT",
          body: JSON.stringify(preset),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$store.state.accessToken,
          },
        };
        // send POST request
        fetch(url, options).then((res) => {
          if (res.status != 201) return;
          this.$swal({
            position: "center",
            icon: "success",
            title:
              '<h4 style="color:#D2D0D2">Your event/variable has been reported</h4>',
            showConfirmButton: false,
            background: "#33353e",
            toast: true,
            timer: 2000,
            willClose: () => {
              this.reportPresetClicked = false;
              location.reload();
            },
          });
        });
      }
    },
    toggleTooltip: function() {
      if (this.tooltipShow) {
        this.tooltipShow = false;
      } else {
        this.tooltipShow = true;
        createPopper(this.$refs.btnRef, this.$refs.tooltipRef, {
          placement: "top",
        });
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      // Then specify how you want your dates to be formatted
      return new Intl.DateTimeFormat("default", { dateStyle: "short" }).format(
        date
      );
    },
    updatePreset(id, onSuccessReload) {
      const myAccounts = this.$msalInstance.getAllAccounts();
      this.account = myAccounts[0];
      const url = this.$hubHopApi.baseUrl + "/presets/" + id;

      // post body data
      const preset = {
        path:
          this.preset.vendor +
          "." +
          this.preset.aircraft +
          "." +
          this.preset.system +
          "." +
          this.preset.label,
        vendor: this.preset.vendor,
        aircraft: this.preset.aircraft,
        system: this.preset.system,
        code: this.preset.code,
        label: this.preset.label,
        tags: this.preset.tags,
        presetType: this.preset.presetType,
        version: this.preset.version,
        status: "Updated",
        createdDate: new Date().toUTCString(),
        author: this.preset.author,
        updatedBy: this.$store.state.userSettings.username,
        description: this.preset.description,
        reported: this.preset.reported + 0,
        score: this.preset.score + 0,
      };

      const options = {
        method: "PUT",
        body: JSON.stringify(preset),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.$store.state.accessToken,
        },
      };
      // send POST request
      fetch(url, options).then((res) => {
        console.log(res);
        if (res.status != 201) return;
        this.$swal({
          position: "center",
          icon: "success",
          title:
            '<h4 style="color:#D2D0D2">Your event/variable has been saved</h4>',
          showConfirmButton: false,
          background: "#33353e",
          toast: true,
          timer: 2000,
          willClose: () => {
            if (onSuccessReload) location.reload();
            this.$router.go(-1);
          },
        });
      });
    },
  },
  mounted() {
    fetch(this.$hubHopApi.baseUrl + "/presets/" + this.id)
      .then((res) => res.json())
      .then((data) => (this.preset = data))
      .catch((err) => {
        this.presetNotFound = true;
        console.log(err.massage);
      });
  },
  setup() {
    const openDelete = ref(false);
    const openReport = ref(false);

    const { toClipboard } = useClipboard();
    const preset = ref("this.preset.code");

    const copy = async () => {
      try {
        await toClipboard(preset.value);
        console.log("Copied to clipboard");
      } catch (e) {
        console.error(e);
      }
    };

    return {
      openDelete,
      openReport,
      copy,
      v$: useVuelidate(),
    };
  },
};
</script>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #ffa047;
}
</style>
