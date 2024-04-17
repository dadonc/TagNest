<script lang="ts">
  import Link from "../../assets/feather/Link.svelte";
  import Edit from "../../assets/feather/Edit.svelte";

  import { increaseCountOpened, type SingleItem } from "../../stores/items";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";
  import PreviewName from "./gschert/PreviewName.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
  export let hideName: boolean;

  $: highlightCount = item.bookmark?.BookmarkHighlight.length || 0;
</script>

<div
  class="relative flex flex-col items-center justify-center w-full h-full hoverContainer"
  style={maxHeightStyle}
>
  <img
    src={"file://" + item.bookmark?.previewImagePath}
    alt=""
    class={`h-full ${item.id}_preview`}
  />
  <PreviewName name={item.name || ""} {hideName} />
  {#if item.url && !hideName}
    <a
      target="_blank"
      on:click={() => increaseCountOpened(item)}
      href={item.url}
      class="absolute w-6 h-6 p-1 bg-slate-100 text-primary bottom-2 right-2 hoverDisplay"
    >
      <Link />
    </a>
  {/if}
  <PreviewTypeInfo type={item.type}>
    {#if highlightCount > 0}
      <span class="inline-flex items-center justify-center ml-1">
        <Edit className="w-3 h-3 inline-block text-yellow-200" />
        <span class="highlightCount">
          {highlightCount ? highlightCount : ""}
        </span>
      </span>
    {/if}
  </PreviewTypeInfo>
</div>

<style>
  .hoverDisplay {
    display: none;
  }

  .hoverContainer:hover .hoverDisplay {
    display: block;
  }
</style>
