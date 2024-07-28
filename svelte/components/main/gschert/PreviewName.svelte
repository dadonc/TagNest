<script lang="ts">
  export let name: string = "";
  export let className: string = "";

  export let hideName: boolean;
</script>

<!-- TODO: IDEK, h-7 and min-h-[1.75rem] was more or less trying stupid stuff until it seemed to work -->
<!-- Adding bg-green-500 and minimising the BottomArea using the mouse shows that the current solution isn't ideal.
     This effect is even more pronounced if the bottomBar doesn't automatically collapse if it is too small 
     - see Layout.svelte:dragBottom  -->
{#if !hideName}
  <div class="w-full h-7 min-h-[1.75rem] shrink-0"></div>
  <div
    class={"absolute bottom-0 left-0 w-full max-h-full overflow-scroll p-1  text-sm text-ellipsis bg-base-300 whitespace-nowrap nameDiv " +
      className}
  >
    {name}
  </div>
{/if}
