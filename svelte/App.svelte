<svelte:options immutable={true} />

<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";
  import BottomBar from "./components/bottom/BottomBar.svelte";
  import LeftArea from "./components/left/LeftArea.svelte";
  import Main from "./components/main/Main.svelte";
  import RightArea from "./components/right/RightArea.svelte";
  import TopBar from "./components/top/TopBar.svelte";
  import startImportTasks from "./components/main/import/importQueue";
  import BottomArea from "./components/bottom/BottomArea.svelte";
  import {
    contextMenuStore,
    currentRoute,
    filteredData,
    selectedItems,
    settingsJson,
  } from "./stores/stateStore";
  import Settings from "./components/settings/Settings.svelte";
  import {
    exitFakeFullscreen,
    possibylCloseContextMenu,
    toggleLeft,
    toggleRight,
  } from "./utils";
  import { startDeleteTasks } from "./components/main/delete/DeleteQueue";
  import DeleteConfirmModal from "./components/modals/DeleteConfirmModal.svelte";
  import { shuffleItems } from "./stores/items";

  let isDataAvailable = false;
  let data: Awaited<typeof $filteredData>;
  $: $filteredData.then((filtered) => (data = filtered));

  onMount(async () => {
    exitFakeFullscreen();
    let getSettingsJson = await window.electron.getSettingsJson();
    settingsJson.set(getSettingsJson);
    startImportTasks();
    startDeleteTasks();
    data = await $filteredData;
    isDataAvailable = true;

    window.electron.onOpenSettings(() => {
      $currentRoute = "settings";
    });
  });

  let isDevToolsOpen = false;

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "," && event.metaKey) {
      $currentRoute = "settings";
    } else if (event.key === "Escape") {
      if ($currentRoute === "settings") {
        $currentRoute = "main";
      }
    } else if ((event.key === "j" && event.metaKey) || event.key === "º") {
      if (isDevToolsOpen) {
        window.electron.closeDevTools();
      } else {
        window.electron.openDevTools();
      }
    } else if (event.key === "i" && event.metaKey) {
      if ($selectedItems.ids.length !== 0) {
        $contextMenuStore.openModal = "editItem";
      }
    } else if (event.key === "b" && event.metaKey && !event.shiftKey) {
      toggleLeft();
    } else if (event.key === "b" && event.metaKey && event.shiftKey) {
      toggleRight();
    } else if (event.key === "s" && event.metaKey && event.shiftKey) {
      shuffleItems();
    } else if (event.key === "0" && event.metaKey && event.shiftKey) {
      $settingsJson.savePath = $settingsJson.oldSavePath || "";
      await window.electron.updateSettingsJson($settingsJson);
      window.electron.restartApp();
    }
  };
</script>

<svelte:window
  on:keydown={handleKeyDown}
  on:click={(e) => {
    possibylCloseContextMenu(e);
  }}
  on:contextmenu={possibylCloseContextMenu}
/>

<DeleteConfirmModal />

<main>
  {#if $currentRoute === "settings"}
    <Settings />
  {:else if isDataAvailable}
    <Layout>
      <svelte:fragment slot="topContainer">
        <TopBar />
      </svelte:fragment>
      <svelte:fragment slot="mainContainer">
        <Main items={data.items} />
      </svelte:fragment>
      <svelte:fragment slot="rightContainer">
        <RightArea items={data.items} />
      </svelte:fragment>
      <svelte:fragment slot="bottomDivider">
        <BottomBar itemsCount={data.items.length} />
      </svelte:fragment>
      <svelte:fragment slot="bottomContainer">
        <BottomArea items={data.items} />
      </svelte:fragment>
      <svelte:fragment slot="leftContainer">
        <LeftArea tags={data.tags} />
      </svelte:fragment>
    </Layout>
  {/if}
</main>
