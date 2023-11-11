<!-- https://cssloaders.github.io/ -->

<span class="loader" />

<style>
  .loader {
    width: 1rem;
    height: 1rem;
    border: 5px solid #f97316; /* orange-500 */
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
