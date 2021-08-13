<template>
  <div class="md:flex md:space-x-5">
    <div
      class="bg-hhCard flex md:block justify-center mx-auto rounded-lg shadow-lg py-5 mb-5 md:mb-0 w-full"
    >
      <div>
        <h3>Dashboard</h3>
      </div>
      <div class="space-y-5 mt-5">
        <div class="grid grid-cols-3 gap-5 px-5">
          <div class="bg-hhBG rounded-lg shadow-lg">
            KPI 1
          </div>
          <div class="bg-hhBG rounded-lg shadow-lg">
            KPI 2
          </div>
          <div class="bg-hhBG rounded-lg shadow-lg">
            KPI 3
          </div>
        </div>
        <div class="container mx-auto px-5">
          <div class="bg-hhBG rounded-lg shadow-lg">
            Großes für den Graphen oder Liste
          </div>
        </div>
        <div class="container mx-auto px-5">
          <div class="bg-hhBG rounded-lg shadow-lg">
            Großes für den Graphen oder Liste
          </div>
        </div>
        <div class="container mx-auto px-5">
          <div class="bg-hhBG rounded-lg shadow-lg">
            Großes für den Graphen oder Liste
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GeneralDashboard",
};
</script>
