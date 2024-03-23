<script lang="ts">
  let display: "grid" | "list" = "grid";

  function changeDisplay() {
    display = display === "grid" ? "list" : "grid";
  }
</script>

<button on:click={changeDisplay} class="w-8 mr-4">
  {display}
</button>
