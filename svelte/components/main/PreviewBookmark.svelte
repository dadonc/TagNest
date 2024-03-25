<script lang="ts">
  import Link from "../../assets/feather/Link.svelte";
  import { increaseCountOpened, type SingleItem } from "../../stores/items";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
</script>

<div
  class="relative flex items-center justify-center w-full h-full border-2 hoverContainer border-base-300"
>
  <img
    src={"file://" + item.bookmark?.previewImagePath}
    alt=""
    class="max-h-full"
    style={maxHeightStyle}
  />
  {#if item.url}
    <a
      target="_blank"
      on:click={() => increaseCountOpened(item)}
      href={item.url}
      class="absolute w-6 h-6 p-1 bg-base-100 text-primary bottom-2 right-2 hoverDisplay"
    >
      <Link />
    </a>
  {/if}
  <PreviewTypeInfo type={item.type} />
</div>

<style>
  .hoverDisplay {
    display: none;
  }

  .hoverContainer:hover .hoverDisplay {
    display: block;
  }
</style>
