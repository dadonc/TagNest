<script lang="ts">
  export let name: string = "";
  export let className: string = "";
</script>

<div
  class={"absolute bottom-0 left-0 w-full max-h-full overflow-scroll p-1  text-sm text-ellipsis bg-base-300 whitespace-nowrap nameDiv " +
    className}
>
  {name}
</div>
