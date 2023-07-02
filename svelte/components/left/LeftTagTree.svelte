<script lang="ts">
  import type { TagTree } from "../../stores/stateStore";
  import LeftSingleTag from "./LeftSingleTag.svelte";

  export let tagTree: any;
  export let indent: number;
</script>

{#each Object.keys(tagTree) as key}
  <div
    class={key !== "_tags" ? `ml-${indent + 3}` : ""}
    style={key !== "_tags" ? `margin-left: ${indent * 1.5}rem` : ""}
  >
    <div
      class="pl-1 no-select"
      on:keydown={(e) => {
        if (e.target) {
          e.stopPropagation();
          if (e.key === "Enter") {
            // @ts-ignore
            e.target.classList.toggle("classToKeep");
          }
        }
      }}
      on:click={(e) => {
        if (e.target) {
          e.stopPropagation();
          // @ts-ignore
          e.target.classList.toggle("classToKeep");
        }
      }}
    >
      {#if key !== "_tags"}
        v {key}
      {/if}
      {#if Array.isArray(tagTree[key]) && key === "_tags"}
        {#each tagTree[key] as tag}
          <LeftSingleTag {tag} />
        {/each}
      {:else}
        <svelte:self tagTree={tagTree[key]} indent={indent + 1} />
      {/if}
    </div>
  </div>
{/each}

<style>
  .classToKeep {
    color: #fff;
  }
  .classToKeep div {
    display: none;
  }
</style>
