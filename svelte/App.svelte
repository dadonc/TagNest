<script lang="ts">
  import Layout from "./Layout.svelte";
  import { getUsers } from "./db";
  import CssStoreRenderer from "./stores/CssStoreRenderer.svelte";
  let users = getUsers();
</script>

<main>
  <Layout />
</main>
