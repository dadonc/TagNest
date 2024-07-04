<script lang="ts">
  import ArrowDown from "../../assets/feather/ArrowDown.svelte";
  import ShuffleIcon from "../../assets/feather/ShuffleIcon.svelte";
  import { shuffleItems } from "../../stores/items";
  import { currView } from "../../stores/stateStore";

  function changeDirection() {
    (document.activeElement as HTMLElement)?.blur();
    $currView.orderDirection =
      $currView.orderDirection === "asc" ? "desc" : "asc";
  }

  function setOrderBy(e: Event) {
    $currView.orderBy = (e.target as HTMLSelectElement).value as any;
    if ($currView.orderBy === "shuffle") {
      shuffleItems();
    }
  }
</script>

<select on:change={setOrderBy}>
  <option selected={$currView.orderBy === "createdAt"} value="createdAt"
    >File created</option
  >
  <option selected={$currView.orderBy === "updatedAt"} value="updatedAt"
    >Date modified</option
  >
  <option selected={$currView.orderBy === "name"} value="name">Name</option>
  <option selected={$currView.orderBy === "fileSize"} value="fileSize"
    >File size</option
  >
  <option selected={$currView.orderBy === "countOpened"} value="countOpened"
    >Count opened</option
  >
  <option selected={$currView.orderBy === "shuffle"} value="shuffle"
    >Shuffle</option
  >
</select>

{#if $currView.orderBy !== "shuffle"}
  <button
    on:click={changeDirection}
    class="p-2"
    title={$currView.orderDirection === "asc" ? "Ascending" : "Descending"}
  >
    {#if $currView.orderDirection === "asc"}
      <ArrowDown className="h-3 w-3 text-base-content rotate-180 font-thin" />
    {:else}
      <ArrowDown className="h-3 w-3 text-base-content" />
    {/if}
  </button>
{:else}
  <button
    on:click={shuffleItems}
    class="p-2 cursor-pointer"
    title="Shuffle items"
  >
    <ShuffleIcon className="h-4 w-4 text-base-content" />
  </button>
{/if}

<style>
  select {
    appearance: none;
    background-color: var(--bg-base);
    border: none;
    outline: none;
    box-shadow: none;
    color: var(--text-base);
    font-size: 0.875rem;
    padding: 0.25rem 1.25rem 0.25rem 0.25rem;
    -webkit-app-region: no-drag;
    cursor: pointer;
    background-position: right;
  }

  select option {
    margin-right: 1rem;
  }
</style>
