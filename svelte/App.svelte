<script lang="ts">
  import Layout from "./Layout.svelte";
  import TopBar from "./components/TopBar.svelte";
</script>

<main>
  <Layout>
    <svelte:fragment slot="topContainer">
      <TopBar />
    </svelte:fragment>
  </Layout>
</main>
