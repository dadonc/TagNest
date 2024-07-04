<script lang="ts">
  import type { Tag } from "@prisma/client";
  import { classNames } from "../../../utils";
  import TagAutocomplete from "./TagAutocomplete.svelte";
  import { tick } from "svelte";
  export let tags: Tag[];
  export let tagString: string;

  let displayAutocomplete = false;
  let isAutoCompleteVisible = false;

  const tagStringCopy = tagString;

  const placeholder =
    '<span class="absolute text-gray-500 pointer-events-none">tag1, group:tag2, ...<span>';

  $: containerCSS = `w-full mt-2 pl-4 input input-bordered outlineFuckery h-12 flex items-center p-2 overflow-scroll caret-base-content ${isAutoCompleteVisible ? "rounded-b-none" : "rounded-b"}`;

  let tagsHTML = "";
  let hasUserInteracted = false;
  $: {
    tagsHTML = tagString
      .replace(placeholder, "")
      .split(",")
      .map((t) => t.trim())
      .map((t) => {
        let isExisting = false;
        tags.forEach((tag) => {
          if (tag.name === t) {
            isExisting = true;
          }
        });
        if (isExisting) {
          // if (isGroup) {
          //   return `<span class="text-blue-500">${t}</span>`;
          // }
          return `<span class="text-green-500">${t}</span>`;
        } else {
          return `<span class="text-red-500">${t}</span>`;
        }
      })
      .join(", ");
    if (tagString.length === 0 && !hasUserInteracted) tagsHTML = placeholder;
    tick().then(() => {
      // don't run on initial render
      if (tagStringCopy !== tagString) setEndOfContenteditable(textInput);
    });
  }

  const handleKeydown = (e: any) => {
    hasUserInteracted = true;
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    } else {
      tagString = e.target.innerText;
    }
  };

  function setEndOfContenteditable(contentEditableElement: HTMLDivElement) {
    // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity/3866442#3866442
    var range, selection;
    if (document.createRange) {
      //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection?.removeAllRanges(); //remove any selections already made
      selection?.addRange(range); //make the range you have just created the visible selection
    }
  }

  let textInput: HTMLDivElement;
</script>

<div class="relative">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    contenteditable="true"
    spellcheck="false"
    tabindex="0"
    bind:this={textInput}
    class={containerCSS}
    on:input={handleKeydown}
    on:focus={() => {
      displayAutocomplete = true;
      if (tagsHTML == placeholder) {
        tagsHTML = "&nbsp;";
      }
      console.log("setend");
      setTimeout(() => {
        setEndOfContenteditable(textInput);
      }, 0);
    }}
    on:click={() => {
      setTimeout(() => {
        setEndOfContenteditable(textInput);
      }, 0);
    }}
    on:blur={(event) => {
      if (
        tagsHTML == "&nbsp;" ||
        tagsHTML.length === 0 ||
        tagsHTML == '<span class="text-red-500"></span>'
      ) {
        hasUserInteracted = false;
        tagsHTML = placeholder;
      }
      if (
        !(
          event.relatedTarget &&
          //@ts-ignore
          event.relatedTarget.classList &&
          //@ts-ignore
          event.relatedTarget.classList.contains("JS-autocomplete-item")
        )
      ) {
        displayAutocomplete = false;
        isAutoCompleteVisible = false;
      }
    }}
  >
    {@html tagsHTML}
  </div>

  {#if displayAutocomplete}
    <TagAutocomplete
      {tags}
      bind:tagString
      bind:displayAutocomplete
      bind:isAutoCompleteVisible
    />
  {/if}
</div>

<style>
  .outlineFuckery:focus {
    /* Fucking tailwind/forms and DaisyUI */
    box-shadow: none;
    outline: 2px solid;
    outline-offset: -2px;
    /*TODO - use variable here*/
    outline-color: #2563eb;
  }
</style>
