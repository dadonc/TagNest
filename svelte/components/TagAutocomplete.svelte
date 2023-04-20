<script lang="ts">
  import type { Tag } from "@prisma/client";
  import fuzzy from "fuzzy";
  import { classNames } from "../utils";

  export let tags: Tag[];
  export let tagString: string;
  export let displayAutocomplete: boolean;
  export let isAutoCompleteVisible: boolean;

  let highlightedIndex = 0;

  const allTagNames = tags.map((t) => t.name);
  $: currentTags = tagString.split(",").map((t) => t.trim());
  $: currentTag =
    tagString.split(",").pop()?.trim().replace("&nbsp;", "") ?? "";

  const options = {
    extract: function (tag: Tag) {
      return tag.name;
    },
  };
  $: matches = fuzzy.filter(currentTag, tags, options).filter((match) => {
    // remove empty matches and tags that are already in the list
    return match.string && currentTags.indexOf(match.string) === -1;
  });

  function addTag(i: number | undefined = undefined) {
    if (i) {
      highlightedIndex = i;
    }
    const curr = currentTags.filter(Boolean);
    // if last tag is not a valid tag, remove it
    // it is not a valid tag if some characters were already written to filter the matches
    // and the last tag isn't terminated with a comma (which would be a new tag)
    if (curr.length > 0 && allTagNames.indexOf(curr[curr.length - 1]) === -1) {
      if (!(tagString.endsWith(",") || tagString.endsWith(", "))) {
        curr.pop();
      }
    }
    if (matches[highlightedIndex]) {
      tagString = [...curr, matches[highlightedIndex].string + ",&nbsp;"].join(
        ", "
      );
    }
    if (highlightedIndex === matchesToShow.length - 1) {
      highlightedIndex = 0;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      addTag();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % matchesToShow.length;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightedIndex =
        (highlightedIndex - 1 + matchesToShow.length) % matchesToShow.length;
    }
    if (event.key === "Escape") {
      displayAutocomplete = false;
    }
  }

  $: matchesToShow = matches
    ? matches.slice(0, 5).map((m) => m.string)
    : allTagNames.slice(0, 5);

  $: isAutoCompleteVisible = matchesToShow.length > 0;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isAutoCompleteVisible}
  <div
    class="absolute w-full border-2 border-t-0 rounded-lg rounded-t-none bg-base-300 border-primary"
  >
    <ul>
      {#each matchesToShow as match, i}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          tabindex="0"
          on:click={() => addTag(i)}
          on:keydown={() => {}}
          class={classNames(
            "py-1 pl-4 JS-autocomplete-item",
            i === highlightedIndex
              ? "bg-secondary text-white"
              : "hover:bg-secondary hover:text-white"
          )}
        >
          {match}
        </div>
      {/each}
    </ul>
  </div>
{/if}
