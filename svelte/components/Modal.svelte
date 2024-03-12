<script lang="ts">
  import { fade } from "svelte/transition";
  export let isOpen = false;
  export let closeOnClickOutside = true;
  export let close: () => void;
  export let isFullWidth = true;

  function possiblyBlur() {
    const el = document.activeElement as HTMLElement;
    if (el.contentEditable === "true") {
      el.blur();
      document.getElementById("modal")?.focus();
      return true;
    }
    return false;
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-autofocus -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    tabindex="0"
    id="modal"
    autofocus
    on:click={(e) => {
      if (closeOnClickOutside && e.target === e.currentTarget) {
        close();
      }
    }}
    on:keydown={(e) => {
      if (e.key === "Escape") {
        possiblyBlur() || close();
      }
    }}
    transition:fade={{ duration: 200 }}
    class={`transition-opacity duration-200 fixed overflow-scroll top-0 bottom-0 left-0 right-0 grid place-items-center bg-fadeBg focus:outline-none`}
    style="z-index: 99999;"
  >
    <div class={`${isFullWidth ? "w-full" : "max-w-xl"} m-8 rounded`}>
      <slot name="body" />
    </div>
  </div>
{/if}
