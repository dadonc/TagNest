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
    htmlDoc.window.document
      .querySelectorAll("a")
      .forEach((aTag: HTMLAnchorElement) => {
        aTag.setAttribute("target", "_blank");
      });
    html = new XMLSerializer().serializeToString(htmlDoc.window.document);
  });
</script>

<iframe srcdoc={html} class="w-full h-full" title={item.name} />
