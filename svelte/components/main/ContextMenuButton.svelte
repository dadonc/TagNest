<script lang="ts">
  export let name: string;
  export let onClick: () => void;
</script>

<button
  class="py-1 mx-2 text-left border-b w-44 text-base-content hover:text-primary border-base-content"
  on:click={onClick}
>
  {name}
</button>
