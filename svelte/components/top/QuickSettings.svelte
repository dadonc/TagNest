<script lang="ts">
  import { currView } from "../../stores/stateStore";

  function changeDisplay() {
    $currView.viewType = $currView.viewType === "grid" ? "list" : "grid";
  }
</script>

{#if false}
  <button on:click={changeDisplay} class="w-8 mr-4">
    {$currView.viewType}
  </button>
{/if}
