<script lang="ts">
  import { currView } from "../stores/CurrViewStore";
</script>

<div class="flex items-center h-full text-2xl">
  <span
    class="inline-block"
    style="width: calc( 1rem + var(--leftContainer))"
  />

  <button
    on:click={() => {
      currView.update((v) => {
        if (v.zoomLvl === 1) return v;
        v.zoomLvl = v.zoomLvl - 1;
        return v;
      });
    }}
    class="ml-2 mr-4">+</button
  >

  <button
    on:click={() => {
      currView.update((v) => {
        v.zoomLvl = v.zoomLvl + 1;
        return v;
      });
    }}>-</button
  >
</div>
