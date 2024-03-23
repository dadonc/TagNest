<script lang="ts">
  import ArrowDown from "../../assets/feather/ArrowDown.svelte";
  import ShuffleIcon from "../../assets/feather/ShuffleIcon.svelte";
  import { items } from "../../stores/items";
  import { currView } from "../../stores/stateStore";

  function changeDirection() {
    $currView.orderDirection =
      $currView.orderDirection === "asc" ? "desc" : "asc";
  }

  function setOrderBy(e: Event) {
    $currView.orderBy = (e.target as HTMLSelectElement).value as any;
  }

  async function shuffleItems() {
    function shuffleArray(array: any[]) {
      // https://stackoverflow.com/a/12646864
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    $currView.orderBy = "shuffle";
    $items = shuffleArray($items);
  }
</script>

<select on:change={setOrderBy}>
  <option selected={$currView.orderBy === "createdAt"} value="createdAt"
    >Date added</option
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
  <option selected={$currView.orderBy === "shuffle"} value="shuffle">---</option
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
  <div class="w-3 p-2"></div>
{/if}
<button
  on:click={shuffleItems}
  class="p-2 cursor-pointer"
  title="Shuffle items"
>
  <ShuffleIcon className="h-4 w-4 text-base-content" />
</button>

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
