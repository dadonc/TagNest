<script lang="ts">
  import Layout from "./Layout.svelte";
  import BottomBar from "./components/BottomBar.svelte";
  import Main from "./components/Main.svelte";
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
    <svelte:fragment slot="bottomDivider">
      <BottomBar />
    </svelte:fragment>
  </Layout>
</main>
