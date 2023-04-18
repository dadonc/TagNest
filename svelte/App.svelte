<script lang="ts">
  import Layout from "./Layout.svelte";
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
  </Layout>
</main>
