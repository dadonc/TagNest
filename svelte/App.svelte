<svelte:options immutable={true} />

<script lang="ts">
  import Layout from "./Layout.svelte";
  import BottomBar from "./components/BottomBar.svelte";
  import LeftArea from "./components/LeftArea.svelte";
  import Main from "./components/Main.svelte";
  import RightArea from "./components/RightArea.svelte";
  import TopBar from "./components/TopBar.svelte";
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
