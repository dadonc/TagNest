<script lang="ts">
  import { fade } from "svelte/transition";
  export let isOpen = false;
  export let closeOnClickOutside = true;
  export let close: () => void;
  export let isFullWidth = true;
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
    class={`transition-opacity duration-200 absolute top-0 bottom-0 left-0 grid place-items-center w-screen h-screen bg-fadeBg focus:outline-none`}
    style="z-index: 99999;"
  >
    <div
      class={`${
        isFullWidth ? "w-full" : "max-w-xl"
      } h-full overflow-scroll rounded flex flex-col justify-center`}
    >
      <slot name="body" />
    </div>
  </div>
{/if}
