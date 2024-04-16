<script lang="ts">
  export let name: string = "";
  export let className: string = "";
  export let style: string = "";
</script>

<div
  class={"absolute bottom-0 left-0 w-full p-1 overflow-hidden text-sm text-ellipsis bg-base-300 whitespace-nowrap nameDiv " +
    className}
  {style}
>
  {name}
</div>
