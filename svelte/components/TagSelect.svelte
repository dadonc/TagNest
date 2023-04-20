<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { allTags } from "../stores/tags";
  import { classNames } from "../utils";
  import TagAutocomplete from "./TagAutocomplete.svelte";

  export let item: SingleItem | null;
  export let tagString: string;

  let displayAutocomplete = false;
  let isAutoCompleteVisible = false;
</script>

<div class="relative">
  <input
    bind:value={tagString}
    type="text"
    placeholder="Tags"
    class={classNames(
      "w-full mt-2 input input-bordered outlineFuckery",
      isAutoCompleteVisible ? "rounded-b-none" : ""
    )}
    on:focus={() => {
      displayAutocomplete = true;
    }}
    on:blur={() => {
      displayAutocomplete = false;
    }}
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  />
  {#if displayAutocomplete}
    {#await $allTags}
      <div>Loading...</div>
    {:then tags}
      <TagAutocomplete
        {tags}
        bind:tagString
        bind:displayAutocomplete
        bind:isAutoCompleteVisible
      />
    {/await}
  {/if}
</div>

<style>
  .outlineFuckery:focus {
    /* Fucking tailwind/forms and DaisyUI */
    box-shadow: none;
    outline: 1px solid;
    outline-offset: -2px;
    @apply outline-primary;
  }
</style>
