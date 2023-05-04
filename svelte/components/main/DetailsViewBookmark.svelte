<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import mhtml2html from "../../assets/deps/mhtml2html";

  export let item: SingleItem;
  let html: string;
  onMount(async () => {
    const mhtml = await window.electron.readFile(
      item.bookmark?.mhtmlPath as string
    );
    let htmlDoc = mhtml2html.convert(mhtml);
    html = new XMLSerializer().serializeToString(htmlDoc.window.document);
  });
</script>

{@html html}
