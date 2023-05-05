<svelte:options immutable={true} />

<script lang="ts">
  import { onMount } from "svelte";
  import Layout from "./Layout.svelte";
  import BottomBar from "./components/BottomBar.svelte";
  import LeftArea from "./components/left/LeftArea.svelte";
  import Main from "./components/main/Main.svelte";
  import RightArea from "./components/right/RightArea.svelte";
  import TopBar from "./components/top/TopBar.svelte";
  import startImportTasks from "./components/main/import/importQueue";

  onMount(() => {
    startImportTasks();
  });
</script>

<main>
  <Layout>
    <svelte:fragment slot="topContainer">
      <TopBar />
    </svelte:fragment>
    <svelte:fragment slot="mainContainer">
      <Main />
    </svelte:fragment>
    <svelte:fragment slot="rightContainer">
      <RightArea />
    </svelte:fragment>
    <svelte:fragment slot="bottomDivider">
      <BottomBar />
    </svelte:fragment>
    <svelte:fragment slot="leftContainer">
      <LeftArea />
    </svelte:fragment>
  </Layout>
</main>
