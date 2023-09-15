<script lang="ts">
  import LeftSingleTag from "./LeftSingleTag.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";

  export let tagTree: any;
  export let indent: number;

  const rotateChevron = (e: Event) => {
    const target = e.target as HTMLElement;
    const svg = target.children[0];
    if (svg.nodeName !== "svg") return;
    if (svg.classList.contains("-rotate-90")) {
      svg.classList.remove("-rotate-90");
      svg.classList.add("rotate-180");
    } else {
      svg.classList.add("-rotate-90");
      svg.classList.remove("rotate-180");
    }
  };
</script>

{#each Object.keys(tagTree) as key}
  <div
    class={key !== "_tags" ? `ml-${indent + 3}` : ""}
    style={key !== "_tags" ? `margin-left: ${indent * 1.5}rem` : ""}
  >
    <div
      class="pl-1 select-none"
      on:keydown={(e) => {
        if (e.target) {
          e.stopPropagation();
          if (e.key === "Enter") {
            // @ts-ignore
            e.target.classList.toggle("classToKeep");
            rotateChevron(e);
          }
        }
      }}
      on:click={(e) => {
        if (e.target) {
          e.stopPropagation();
          // @ts-ignore
          e.target.classList.toggle("classToKeep");
          rotateChevron(e);
        }
      }}
    >
      {#if key !== "_tags"}
        <ChevronLeft className="h-2 w-2 inline-block -rotate-90" />
        {key}
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
