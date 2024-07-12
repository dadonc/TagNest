<script lang="ts">
  export let keys: string[] = [];
  export let description: string = "";
  export let combinator: string = "+";
</script>

<div class="flex mb-2">
  <div class="shrink-0">
    {#each keys as key, index}
      <kbd>{key}</kbd> {index !== keys.length - 1 ? combinator + " " : ""}
    {/each}
  </div>
  <div class="ml-4">{description}</div>
</div>

<style>
  kbd {
    background-color: white;
    border-radius: 0.2rem;
    border: 1px solid #ccc;
    padding: 0.2rem 0.4rem;
  }
</style>
