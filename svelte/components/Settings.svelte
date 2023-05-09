<script lang="ts">
  import { onMount } from "svelte";

  let wasChanged = false;
  let savePath = "";
  onMount(async () => {
    savePath = await window.electron.getSavePath();
  });
</script>

<div class="h-6 bg-base-300" style="-webkit-app-region: drag;" />
<div class="max-w-xl p-4 m-auto">
  <h1 class="text-4xl font-bold text-center">Settings</h1>

  <h2 class="mt-4 text-xl font-bold">Data location</h2>
  <p>The location of the database and accompanying files</p>
  <div class="my-2 text-sm italic">{savePath}</div>
  <button
    class="text-primary"
    on:click={async () => {
      const newPath = await window.electron.getNewSavePath();
      if (newPath && newPath !== savePath) {
        savePath = newPath;
        wasChanged = true;
      }
    }}>Change path</button
  >

  {#if wasChanged}
    <div class="p-4 rounded bg-base-300">
      <p class="text-xl font-bold">Save changes?</p>

      <div class="p-4 my-4 rounded-md bg-yellow-50">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="w-5 h-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Restart application
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>
                You need to restart the application for the changes to take
                efffect
              </p>
            </div>
          </div>
        </div>
      </div>

      <label>
        <input type="checkbox" />
        Move existing database and files to new location
      </label>
      <button
        class="block text-primary"
        on:click={async () => {
          await window.electron.setSavePath(savePath);
          wasChanged = false;
        }}>Save</button
      >
    </div>
  {/if}

  <!-- <div class="flex justify-center mt-8 gap-x-4">
    <button class="btn btn-secondary">Cancel</button>

    <button disabled={!wasChanged} class="btn btn-primary">Save</button>
  </div> -->
</div>
