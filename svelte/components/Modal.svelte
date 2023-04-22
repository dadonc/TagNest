<script lang="ts">
  import { fade } from "svelte/transition";
  export let isOpen = false;
  export let closeOnClickOutside = false;
  export let close: () => void;
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-autofocus -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    tabindex="0"
    autofocus
    on:click={(e) => {
      if (closeOnClickOutside && e.target === e.currentTarget) {
        close();
      }
    }}
    on:keydown={(e) => {
      if (e.key === "Escape") {
        close();
      }
    }}
    transition:fade={{ duration: 200 }}
    class={`transition-opacity z-10 duration-200 absolute top-0 bottom-0 left-0 grid place-items-center w-screen h-screen bg-fadeBg`}
  >
    <div
      class="w-full p-2 overflow-scroll rounded modalMaxHeight md:w-3/4 lg:w-1/2 bg-base-100"
    >
      <slot name="body" />
    </div>
  </div>
{/if}

<style>
  .modalMaxHeight {
    max-height: calc(100vh - 2rem);
  }
</style>
