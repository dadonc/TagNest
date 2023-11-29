<script lang="ts">
  import Link from "../../assets/feather/Link.svelte";
  import type { SingleItem } from "../../stores/items";
  import { currentRoute } from "../../stores/stateStore";

  export let item: SingleItem;
</script>

<div class="relative hoverContainer">
  <img
    src={"file://" + item.file?.path}
    alt=""
    class=""
    style={$currentRoute == "details"
      ? "max-height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2)"
      : ""}
  />
  {#if item.url}
    <a
      target="_blank"
      href={item.url}
      class="absolute w-6 h-6 p-1 bg-base-100 text-primary bottom-2 right-2 hoverDisplay"
    >
      <Link />
    </a>
  {/if}
</div>

<style>
  .hoverDisplay {
    display: none;
  }

  .hoverContainer:hover .hoverDisplay {
    display: block;
  }
</style>
