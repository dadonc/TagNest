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
  import Pins from "./components/main/Pins.svelte";
  import { addPin, closePin, pins } from "./stores/pins";

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
      } else {
        (document.activeElement as HTMLElement)?.blur();
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
    } else if (event.key === "f" && event.metaKey) {
      document.getElementById("searchInput")?.focus();
    } else if (event.key === "w" && event.metaKey) {
      if ($selectedItems.ids.length === 1 && $currentRoute === "details") {
        closePin($selectedItems.ids[0]);
      }
      event.preventDefault();
    } else if (event.metaKey && event.altKey && event.key === "ArrowRight") {
      event.preventDefault();
      if ($currentRoute === "main" && $pins.length > 1) {
        $selectedItems.ids = [$pins[1].itemId || ""];
        $currentRoute = "details";
      } else if ($currentRoute === "details" && $pins.length > 1) {
        let index = $pins.findIndex(
          (pin) => pin.itemId === $selectedItems.ids[0]
        );
        if (index < $pins.length - 1) {
          $selectedItems.ids = [$pins[index + 1].itemId || ""];
        } else {
          $currentRoute = "main";
        }
      }
    } else if (event.metaKey && event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      // jump to last
      if ($currentRoute === "main" && $pins.length > 1) {
        $selectedItems.ids = [$pins[$pins.length - 1].itemId || ""];
        $currentRoute = "details";
      } else if ($currentRoute === "details" && $pins.length > 1) {
        let index = $pins.findIndex(
          (pin) => pin.itemId === $selectedItems.ids[0]
        );
        // jump left if there is a pin to the left
        if (index > 1) {
          $selectedItems.ids = [$pins[index - 1].itemId || ""];
        } else {
          $currentRoute = "main";
        }
      }
    } else if (event.metaKey && event.key === "p") {
      if ($selectedItems.ids.length === 1) {
        addPin($selectedItems.ids[0]);
      }
    } else if (event.metaKey && event.key === "1") {
      if ($pins.length > 0) {
        $selectedItems.ids = [$pins[0].itemId || ""];
        $currentRoute = "main";
      }
    } else if (event.metaKey && event.key === "2") {
      if ($pins.length > 1) {
        $selectedItems.ids = [$pins[1].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "3") {
      if ($pins.length > 2) {
        $selectedItems.ids = [$pins[2].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "4") {
      if ($pins.length > 3) {
        $selectedItems.ids = [$pins[3].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "5") {
      if ($pins.length > 4) {
        $selectedItems.ids = [$pins[4].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "6") {
      if ($pins.length > 5) {
        $selectedItems.ids = [$pins[5].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "7") {
      if ($pins.length > 6) {
        $selectedItems.ids = [$pins[6].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "8") {
      if ($pins.length > 7) {
        $selectedItems.ids = [$pins[7].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "9") {
      if ($pins.length > 8) {
        $selectedItems.ids = [$pins[8].itemId || ""];
        $currentRoute = "details";
      }
    } else if (event.metaKey && event.key === "0") {
      if ($pins.length > 9) {
        $selectedItems.ids = [$pins[9].itemId || ""];
        $currentRoute = "details";
      }
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
        <Pins />
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
