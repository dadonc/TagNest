<script lang="ts">
  export let name: string = "";
  export let className: string = "";
  export let style: string = "";
</script>

<div
  class={"bottom-0 w-full p-2 mt-2 break-words bg-base-300 " + className}
  {style}
>
  {name}
</div>
