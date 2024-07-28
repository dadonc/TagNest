<script lang="ts">
  import Link from "../../assets/feather/Link.svelte";
  import type { SingleItem } from "../../stores/items";
  import PreviewName from "./gschert/PreviewName.svelte";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
  export let hideName: boolean;
</script>

<div class="hoverContainer">
  <img
    src={"file://" + item.file?.path}
    alt=""
    style={maxHeightStyle}
    class="w-full"
  />
  <PreviewTypeInfo type={item.type} />
  <PreviewName name={item.name || ""} {hideName} />
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
