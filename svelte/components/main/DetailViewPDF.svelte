<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { onMount } from "svelte";

  let cwd: string;
  onMount(async () => {
    cwd = await window.electron.getCurrentWorkingDirectory();
  });

  export let item: SingleItem;
</script>

{#if cwd}
  <iframe
    src={`file://${cwd}/svelte/assets/deps/pdfjs-3.6.172-dist/web/viewer.html?file=${item.file?.path}`}
    title={item.name}
    class="w-full h-full"
  />
{/if}
