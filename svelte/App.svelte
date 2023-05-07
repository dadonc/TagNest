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
  import { currView, filteredData } from "./stores/stateStore";

  onMount(() => {
    startImportTasks();
  });

  $: canOpenBottom = $currView.route === "details";
</script>

<main>
  <Layout {canOpenBottom}>
    <svelte:fragment slot="topContainer">
      <TopBar />
    </svelte:fragment>
    <svelte:fragment slot="mainContainer">
      <Main />
    </svelte:fragment>
    <svelte:fragment slot="rightContainer">
      {#await $filteredData then data}
        <RightArea items={data.items} />
      {/await}
    </svelte:fragment>
    <svelte:fragment slot="bottomDivider">
      <BottomBar />
    </svelte:fragment>
    <svelte:fragment slot="bottomContainer">
      {#await $filteredData then data}
        <BottomArea items={data.items} />
      {/await}
    </svelte:fragment>
    <svelte:fragment slot="leftContainer">
      <LeftArea />
    </svelte:fragment>
  </Layout>
</main>
