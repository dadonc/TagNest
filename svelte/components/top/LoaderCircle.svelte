<!-- https://cssloaders.github.io/ -->
<script lang="ts">
  export let className = "h-4 w-4 text-orange-500";
</script>

<span class={"loader " + className} />

<style>
  .loader {
    /* width: 1rem;
    height: 1rem;
    border: 5px solid #f97316; */
    /* orange-500 */
    border: 2px solid;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
