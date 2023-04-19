<script lang="ts">
  import { onMount } from "svelte";
  import { currView } from "./CurrViewStore";

  onMount(async () => {
    currView.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("currView", value);
    });
  });
</script>
