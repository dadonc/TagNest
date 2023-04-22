<script lang="ts">
  import ExternalLink from "../assets/feather/ExternalLink.svelte";
  import type { SingleItem } from "../stores/items";
  import { classNames } from "../utils";

  export let item: SingleItem;
</script>

<div class="relative hoverContainer">
  <img src={"file://" + item.file?.path} alt="" />
  {#if item.url}
    <a
      target="_blank"
      href={item.url}
      class="absolute w-6 h-6 p-1 bg-base-100 text-primary bottom-2 right-2 hoverDisplay"
    >
      <ExternalLink />
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
