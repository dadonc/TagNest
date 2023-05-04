<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getItemTypeFromExtension } from "../../../src/utils";

  export let previewSrc: string = "";
  const dispatch = createEventDispatcher();

  async function openFileChooser() {
    window.electron.chooseFile();
  }

  interface FileWithPath extends File {
    path: string;
  }

  function dropHandler(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const url = e.dataTransfer?.getData("URL");
    if (url) {
      window.electron.saveFileFromUrl(url);
      return;
    }

    if (!e.dataTransfer || e.dataTransfer.files.length === 0) {
      return;
    }
    const file = e.dataTransfer.files[0];
    const filePath = (file as FileWithPath).path;
    const type = getItemTypeFromExtension(filePath.split(".").pop() || "");
    if (type === "image") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || !e.target.result) {
          return;
        }
        previewSrc = e.target.result as string;
        dispatch("file-chosen", {
          filePath: (file as FileWithPath).path,
          type,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  window.electron.onChosenFile((_, { base64, path, type }) => {
    if (type === "image") {
      // TODO image type should not always be jpg
      previewSrc = `data:${type}/${path
        .split(".")
        .pop()
        ?.toLowerCase()};base64,${base64}`;
    }
    dispatch("file-chosen", { filePath: path, type });
  });
</script>

{#if !previewSrc}
  <div class="col-span-full">
    <div
      on:dragenter={(e) => e.preventDefault()}
      on:dragover={(e) => e.preventDefault()}
      on:drop={dropHandler}
      class="flex justify-center px-6 py-10 mt-2 border border-dashed rounded-lg"
      style="border-color: hsl(var(--bc) / 0.3)"
    >
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="flex mt-4 text-sm leading-6 text-gray-600">
          <button class="text-primary" on:click={openFileChooser}
            >Upload a file</button
          >
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs leading-5 text-gray-600">images,</p>
      </div>
    </div>
  </div>
{:else}
  <img
    src={previewSrc}
    alt=""
    class="m-auto"
    on:click={openFileChooser}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        openFileChooser();
      }
    }}
  />
{/if}
