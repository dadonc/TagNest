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
  import { currentRoute, filteredData, savePath } from "./stores/stateStore";
  import Settings from "./components/settings/Settings.svelte";
  import { exitFakeFullscreen } from "./utils";

  onMount(async () => {
    startImportTasks();
    exitFakeFullscreen();
    const savePath_ = await window.electron.getSavePath();
    savePath.set(savePath_);
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "," && event.metaKey) {
      $currentRoute = "settings";
    } else if (event.key === "Escape") {
      if ($currentRoute === "settings") {
        $currentRoute = "main";
      }
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<main>
  {#if $currentRoute === "settings"}
    <Settings />
  {:else}
    {#await $filteredData then data}
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
    {/await}
  {/if}
</main>
