<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    contextMenuStore,
    currentRoute,
    selectedItems,
  } from "../../stores/stateStore";
  import { pinBarHeight, pins } from "../../stores/pins";
  import { openContextMenu } from "../../utils";
  import PinContextMenu from "./PinContextMenu.svelte";

  let resizeObserver: ResizeObserver | null = null;
  let container: HTMLElement | null = null;
  let forceReactive = false;

  $: reserveHeight = forceReactive
    ? container?.clientHeight || 0
    : container?.clientHeight || 0;

  onMount(() => {
    resizeObserver = new ResizeObserver(handleResize);
    if (container) {
      resizeObserver.observe(container);
    }
  });

  onDestroy(() => {
    if (resizeObserver && container) {
      resizeObserver.unobserve(container);
    }
  });

  function handleResize() {
    $pinBarHeight = container?.clientHeight || 0;
    forceReactive = !forceReactive;
  }

  function openPinContextMenu(e: MouseEvent, itemId: string) {
    openContextMenu(e, "pin");
  }
</script>

{#if $pins && $pins.length > 1}
  <PinContextMenu />
  <div
    bind:this={container}
    class="fixed z-10 w-full p-2 pt-0 bg-base-100"
    style="width: calc(100% - var(--leftContainer) - var(--dividerWidth) - var(--rightContainer) - var(--dividerWidth));
padding-left: calc(0.5rem + 2px);"
    id="pinContainer"
  >
    {#if $pins && $pins.length > 1}
      {#each $pins as pin}
        <button
          class={"w-16 p-1 mt-2 select-none items-center justify-center focus:outline-none mr-1 text-xs font-mono " +
            (($currentRoute === "main" && pin.currentRoute === "main") ||
            ($currentRoute === "details" &&
              $selectedItems.ids.length === 1 &&
              $selectedItems.ids[0] === pin.itemId)
              ? "bg-base-300 border-2 border-blue-500"
              : "bg-base-100 border border-neutral-500")}
          on:click={() => {
            $selectedItems.ids = [pin.itemId || ""];
            $currentRoute = pin.currentRoute;
          }}
          on:contextmenu={(e) => {
            if (pin.currentRoute !== "main") {
              $contextMenuStore.triggeredByPinItemId = pin.itemId || "";
              openPinContextMenu(e, pin.itemId || "");
            }
          }}>{pin.name.slice(0, 7)}</button
        >
      {/each}
    {/if}
  </div>

  <div class="w-full" style={`height: ${reserveHeight}px;`}></div>
{/if}
