<script lang="ts">
  import Alert from "./Alert.svelte";
  import { currentRoute, settingsJson } from "../../stores/stateStore";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import { get } from "svelte/store";
  import icon from "../../assets/icon/nest.png";
  import KeyboardShortcuts from "./KeyboardShortcuts.svelte";

  let wasSavePathChanged = false;
  let shouldRestart = false;
  let savePath = $settingsJson.savePath;
  let prevSavePath = "";
  let combineBehavior = $settingsJson.combineBehavior;

  let showCombineBehaviorSaveButton = false;
</script>

<div class="h-10 bg-base-300" style="-webkit-app-region: drag;" />
<button
  on:click={() => {
    $currentRoute = "main";
  }}
  class="absolute p-4"
>
  <ChevronLeft className="h-4 w-4" />
</button>
<div class="overflow-scroll" style="height: calc(100vh - 1.5rem)">
  <div class="max-w-xl p-4 m-auto my-4 rounded-md bg-base-200">
    <h1 class="text-2xl font-semibold text-center">Settings</h1>

    <h2 class="mt-4 text-xl font-bold">Data location</h2>
    <p>The location of the database and accompanying files</p>
    <div class="my-2 text-sm italic">{savePath}</div>
    <button
      class="text-primary"
      on:click={async () => {
        const newPath = await window.electron.getNewSavePath();
        if (newPath && newPath !== savePath) {
          prevSavePath = savePath;
          savePath = newPath;
          wasSavePathChanged = true;
        }
      }}>Change path</button
    >

    {#if wasSavePathChanged}
      <div class="p-4 mt-2 rounded bg-base-300">
        <p class="text-xl font-bold">Save changes?</p>

        <Alert
          header="Restart application"
          body="After saving the application will restart."
        />

        <label class="line-through">
          <input type="checkbox" />
          Move existing database and files to new location if no database exists
          there
        </label>
        <div class="mt-2 text-center">
          <button
            on:click={() => {
              savePath = prevSavePath;
              wasSavePathChanged = false;
            }}
          >
            <span class="text-primary">Cancel</span>
          </button>
          <button
            class="btn btn-primary btn-sm"
            on:click={async () => {
              $settingsJson.savePath = savePath;
              await window.electron.updateSettingsJson(get(settingsJson));
              wasSavePathChanged = false;
              window.electron.restartApp();
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

    <h2 class="mt-6 text-xl font-bold">Combine library</h2>
    <p>
      Do you want all files you add to be copied or moved to the data location?
    </p>
    <select
      class="mt-2"
      on:change={(e) => {
        // @ts-ignore
        if (e.target.value !== $settingsJson.combineBehavior) {
          // @ts-ignore
          combineBehavior = e.target.value;
          showCombineBehaviorSaveButton = true;
        } else {
          showCombineBehaviorSaveButton = false;
        }
      }}
    >
      <option selected={combineBehavior === "copy"} value="copy">Copy</option>
      <option selected={combineBehavior === "move"} value="move">Move</option>
      <option selected={combineBehavior === "separate"} value="separate"
        >Keep original path</option
      >
    </select>
    {#if showCombineBehaviorSaveButton}
      <div>
        <label class="block my-2 line-through">
          <input type="checkbox" />
          Update existing files
        </label>
        <button
          class="btn btn-primary btn-sm"
          on:click={async () => {
            $settingsJson.combineBehavior = combineBehavior;
            await window.electron.updateSettingsJson(get(settingsJson));
            showCombineBehaviorSaveButton = false;
          }}>Save</button
        >
      </div>
    {/if}
  </div>
  <div class="max-w-xl p-4 m-auto my-4 rounded-md bg-base-200">
    <h1 class="text-2xl font-semibold text-center">Keyboard shortcuts</h1>
    <KeyboardShortcuts />
  </div>

  <div class="max-w-xl p-4 m-auto my-4 rounded-md bg-base-200">
    <h1 class="text-2xl font-semibold text-center">Attribution</h1>
    <ul class="list-disc">
      <li class="ml-6">
        Nest icon (<img class="inline-block w-4 h-4" src={icon} alt="" />)
        created by
        <a
          target="_blank"
          class="text-primary"
          href="https://www.flaticon.com/free-icons/nest"
          title="nest icons">Freepik - Flaticon</a
        >
      </li>
      <li class="ml-6">
        Other icons from <a
          class="text-primary"
          target="_blank"
          href="https://feathericons.com/">Feather</a
        >
      </li>
    </ul>
  </div>
</div>
