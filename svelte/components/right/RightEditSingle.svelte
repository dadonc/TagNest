<script lang="ts">
  import { type SingleItem } from "../../stores/items";
  import BookmarkPreviewImageChooser from "../modals/BookmarkPreviewImageChooser.svelte";
  import ChooseBookmarkPreview from "../modals/components/ChooseBookmarkPreview.svelte";
  import ChooseVideoThumb from "../modals/components/ChooseVideoThumb.svelte";
  import EditItem from "../modals/components/EditItem.svelte";
  import ItemDetails from "../modals/components/ItemDetails.svelte";
  import VideoDetails from "../modals/components/VideoDetails.svelte";

  export let item: SingleItem;
  let isChooseThumbOpen = false;
</script>

{#key item}
  {#if isChooseThumbOpen && item.type == "video"}
    <ChooseVideoThumb
      {item}
      close={() => {
        isChooseThumbOpen = false;
      }}
    />
  {:else if isChooseThumbOpen && item.type == "bookmark"}
    <ChooseBookmarkPreview
      {item}
      close={() => {
        isChooseThumbOpen = false;
      }}
    />{:else}
    <h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>

    <EditItem {item} bind:isChooseThumbOpen />
    <ItemDetails {item} />
    {#if item.type == "video"}
      <VideoDetails {item} />
    {/if}
  {/if}
{/key}
