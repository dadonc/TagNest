<script lang="ts">
  import Key from "./Key.svelte";

  export let keys: string[] = [];
  export let description: string = "";
  export let combinator: string = "+";
</script>

<div class="flex mb-2">
  <div class="shrink-0">
    {#each keys as key, index}
      <Key {key} /> {index !== keys.length - 1 ? combinator + " " : ""}
    {/each}
  </div>
  <div class="ml-4">{description}</div>
</div>
