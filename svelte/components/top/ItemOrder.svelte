<script lang="ts">
  import ArrowDown from "../../assets/feather/ArrowDown.svelte";
  import { currView } from "../../stores/stateStore";

  function changeDirection() {
    $currView.orderDirection =
      $currView.orderDirection === "asc" ? "desc" : "asc";
  }

  function setOrderBy(e: Event) {
    $currView.orderBy = (e.target as HTMLSelectElement).value as any;
  }
</script>

<select on:change={setOrderBy}>
  <option value="createdAt">Date added</option>
  <option value="updatedAt">Date modified</option>
  <option value="name">Name</option>
  <option value="fileSize">File size</option>
  <option value="countOpened">Count opened</option>
  <option value="shuffle">---</option>
</select>

<button
  on:click={changeDirection}
  class=""
  title={$currView.orderDirection === "asc" ? "Ascending" : "Descending"}
>
  {#if $currView.orderDirection === "asc"}
    <ArrowDown className="h-3 w-3 text-base-content rotate-180 font-thin" />
  {:else}
    <ArrowDown className="h-3 w-3 text-base-content" />
  {/if}
</button>

<style>
  select {
    appearance: none;
    /* -webkit-appearance: none; */
    background-color: var(--bg-base);
    /* border: 1px solid var(--border-base);
    border-radius: 0.375rem; */
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
