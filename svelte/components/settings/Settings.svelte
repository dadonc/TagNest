<script lang="ts">
  import { onMount } from "svelte";
  import Alert from "./Alert.svelte";

  let wasChanged = true;
  let shouldRestart = false;
  let savePath = "";
  onMount(async () => {
    savePath = await window.electron.getSavePath();
  });
</script>

<div class="h-6 bg-base-300" style="-webkit-app-region: drag;" />
<div class="overflow-scroll" style="height: calc(100vh - 1.5rem)">
  <div class="max-w-xl p-4 m-auto my-4">
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
      <div class="p-4 mt-2 rounded bg-base-300">
        <p class="text-xl font-bold">Save changes?</p>

        <Alert
          header="Restart application"
          body="After saving you need to restart the application for changes to take effect."
        />

        <label class="line-through">
          <input type="checkbox" />
          Move existing database and files to new location
        </label>
        <div class="mt-2 text-center">
          <button
            class="btn btn-primary btn-sm"
            on:click={async () => {
              await window.electron.setSavePath(savePath);
              wasChanged = false;
              shouldRestart = true;
            }}>Save</button
          >
        </div>
      </div>
    {/if}

    {#if shouldRestart}
      <div class="p-4 mt-2 rounded bg-base-300">
        <p class="text-xl font-bold">Restart application</p>

        <Alert
          header="Pending changes"
          body="Please restart the application for changes to take effect."
        />
      </div>
    {/if}

    <!-- <div class="flex justify-center mt-8 gap-x-4">
    <button class="btn btn-secondary">Cancel</button>

    <button disabled={!wasChanged} class="btn btn-primary">Save</button>
  </div> -->
  </div>
</div>
