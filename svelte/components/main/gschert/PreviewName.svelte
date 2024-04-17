<script lang="ts">
  export let name: string = "";
  export let className: string = "";

  export let hideName: boolean;
</script>

{#if !hideName}
  <div class="w-full bg-red-500 h-7"></div>
  <div
    class={"absolute outline outline-base-300 bottom-0 left-0 w-full max-h-full overflow-scroll p-1  text-sm text-ellipsis bg-base-300 whitespace-nowrap nameDiv " +
      className}
  >
    {name}
  </div>
{/if}
