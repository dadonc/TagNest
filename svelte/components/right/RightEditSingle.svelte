<script lang="ts">
  import { type SingleItem } from "../../stores/items";
  import BookmarkPreviewImageChooser from "../modals/BookmarkPreviewImageChooser.svelte";
  import ChooseVideoThumb from "../modals/ChooseVideoThumb.svelte";
  import EditItem from "../modals/components/EditItem.svelte";
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
    <BookmarkPreviewImageChooser
      {item}
      on:image-chosen={(ev) => {
        // @ts-ignore
        item.bookmark.previewImagePath = ev.detail.newPreviewPath;
      }}
    />{:else}
    <h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>

    <EditItem {item} bind:isChooseThumbOpen />
    {#if item.type == "video"}
      <VideoDetails {item} />
    {/if}
  {/if}
{/key}
