<template>
    <button class="mx-5 inline-flex justify-center text-base px-4 py-2 font-medium text-hhCard bg-hhOrange rounded-md hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
        <slot/>
    </button>
</template>

<script>
export default {
    name: "Button",
}
</script>