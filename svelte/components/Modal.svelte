<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  export let open = false;
  const dispatch = createEventDispatcher();
</script>

{#if open}
  <!-- svelte-ignore a11y-autofocus -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    tabindex="0"
    autofocus
    on:click={(e) => {
      if (e.target === e.currentTarget) {
        dispatch("close");
      }
    }}
    on:keydown={(e) => {
      console.log(e.key);
      if (e.key === "Escape") {
        dispatch("close");
      }
    }}
    transition:fade={{ duration: 200 }}
    class={`transition-opacity duration-200 opacity-50 absolute top-0 bottom-0 left-0 flex items-center justify-center w-screen h-screen bg-gray-900`}
  >
    <div class="w-64 h-64 p-2 bg-white rounded">
      <slot name="body" />
    </div>
  </div>
{/if}
