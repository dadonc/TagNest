<script lang="ts">
  import {
    importItems,
    updateItem,
    type SingleItem,
  } from "../../../stores/items";
  import TagSelectWrapper from "./TagSelectWrapper.svelte";
  import { confirmDelete } from "../../main/delete/DeleteQueue";
  import PreviewChooser from "../../main/PreviewChooser.svelte";
  import { contextMenuStore } from "../../../stores/stateStore";

  export let isChooseThumbOpen = true;
  export let item: SingleItem;
  let itemCopy = JSON.parse(JSON.stringify(item));
  let tagString = item ? item.tags.map((t) => t.name).join(", ") : "";
  let tagStringCopy = tagString;

  $: disabled =
    JSON.stringify(item) === JSON.stringify(itemCopy) &&
    tagString === tagStringCopy;

  async function update() {
    await updateItem(item, tagString);
  }

  let namePlaceholder = item.name ? item.name : "Name";
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key == "s" && e.metaKey) update();
  }}
/>

<div class="relative flex flex-col items-center justify-center">
  <PreviewChooser {item} hideName />
</div>
{#if item.type === "bookmark" || item.type === "video"}
  <div class="mt-2 text-center">
    <button
      class="text-blue-700"
      on:click={() => {
        if (item.type === "video") {
          $contextMenuStore.openModal = "videoThumbnail";
        } else {
          isChooseThumbOpen = true;
        }
      }}>Change thumbnail</button
    >
  </div>
{/if}
<input
  bind:value={item.name}
  type="text"
  placeholder={namePlaceholder}
  class="w-full mt-6 input input-bordered"
/>
<input
  bind:value={item.url}
  type="text"
  placeholder="URL"
  class="w-full mt-2 input input-bordered"
/>
<TagSelectWrapper bind:tagString />
<textarea
  bind:value={item.note}
  placeholder="Notes"
  class="w-full h-32 mt-2 input input-bordered"
/>
<div class="flex justify-center mt-2 gap-x-2">
  <button {disabled} class="btn btn-primary" on:click={update}> Save</button>
</div>
<div class="flex justify-center">
  <button
    class="mt-4 text-red-600 hover:text-red-800"
    on:click={async () => {
      $importItems = $importItems.filter((i) => i.id !== item.id);
      confirmDelete([item.id]);
    }}>Delete</button
  >
</div>
<div class="h-4" />
