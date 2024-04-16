<script lang="ts">
  export let type: string = "";
</script>

<span
  class="absolute inline-flex items-center justify-center p-1 text-xs text-white rounded-sm typeInfo bg-neutral top-1 left-1"
  >{type}
  <slot />
</span>
