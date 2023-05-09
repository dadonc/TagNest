<script lang="ts">
  import { onMount } from "svelte";
  import { getDocument, GlobalWorkerOptions, PDFWorker } from "pdfjs-dist";
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;

  onMount(async () => {
    //@ts-ignore
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry.js");
    // TODO fix this
    GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const pdf = await getDocument(("file://" + item.file?.path) as string)
      .promise;
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const canvas = document.getElementById("the-canvas") as HTMLCanvasElement;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    console.log(width, height);
    const viewport = page.getViewport({ scale: scale });
    // Support HiDPI-screens.
    const outputScale = window.devicePixelRatio || 1;

    if (!canvas) {
      throw new Error("canvas not found");
    }
    const context = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    const renderContext = {
      canvasContext: context,
      transform: transform,
      viewport: viewport,
    };
    // @ts-ignore
    page.render(renderContext);
  });
</script>

PDF Viewer: {item.name}
<canvas id="the-canvas" class="w-full h-full" />
