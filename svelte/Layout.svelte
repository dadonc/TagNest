<script lang="ts">
  import { onMount } from "svelte";

  import {
    leftContainer,
    rightContainer,
    bottomContainer,
  } from "./stores/CssStore";
  import CssStoreRenderer from "./stores/CssStoreRenderer.svelte";
  import CurrViewStoreRenderer from "./stores/CurrViewStoreRenderer.svelte";

  export let canOpenBottom = true;
  export let canOpenRight = true;

  let gridColString = canOpenRight
    ? "var(--leftContainer) var(--dividerWidth) auto var(--dividerWidth) var(--rightContainer)"
    : "var(--leftContainer) var(--dividerWidth) auto";

  let gridRowString = canOpenBottom
    ? "var(--topContainer) auto var(--bottomDividerHeight) var(--bottomContainer);"
    : "var(--topContainer) auto ";

  onMount(() => {
    if (!canOpenBottom) {
      $bottomContainer.currentVal = "0px";
    }
    // else {
    //   $bottomContainer.currentVal = $bottomContainer.val;
    // }
    if (!canOpenRight) {
      $rightContainer.currentVal = "0px";
    }
  });

  const toggleLeft = () => {
    if ($leftContainer.currentVal === "0px") {
      $leftContainer.currentVal = $leftContainer.val;
    } else {
      $leftContainer.currentVal = "0px";
    }
  };
  const toggleRight = () => {
    if (!canOpenRight) return;
    if ($rightContainer.currentVal === "0px") {
      $rightContainer.currentVal = $rightContainer.val;
    } else {
      $rightContainer.currentVal = "0px";
    }
  };
  const toggleBottom = () => {
    if (!canOpenBottom) return;
    if ($bottomContainer.currentVal === "0px") {
      $bottomContainer.currentVal = $bottomContainer.val;
    } else {
      $bottomContainer.currentVal = "0px";
    }
  };

  const dragLeft = (e: DragEvent) => {
    let val = e.x - 4;
    val = val < 0 ? 0 : val;
    $leftContainer.currentVal = val + "px";
    $leftContainer.val = val + "px";
  };

  const dragRight = (e: DragEvent) => {
    let val = document.documentElement.clientWidth - e.x - 8; // 1rem is the width of the divider
    // when dragging this wraps around to the clientWidth if under 0
    val =
      val <= 0 || val > document.documentElement.clientWidth - 100 ? 0 : val;
    $rightContainer.currentVal = val + "px";
    $rightContainer.val = val + "px";
  };

  const dragBottom = (e: DragEvent) => {
    if (!canOpenBottom) return;
    let val = document.documentElement.clientHeight - e.y;
    val =
      val < 0 || val > document.documentElement.clientHeight - 100 ? 0 : val;
    $bottomContainer.currentVal = val + "px";
    $bottomContainer.val = val + "px";
  };

  let dragHider: HTMLElement;

  function hideDragPreview(this: any, e: DragEvent) {
    // https://www.kryogenix.org/code/browser/custom-drag-image.html
    dragHider = this.cloneNode(true);
    dragHider.style.opacity = "0";
    document.body.appendChild(dragHider);
    e.dataTransfer!.effectAllowed = "copyMove";
    e.dataTransfer?.setDragImage(dragHider, 0, 0);
  }

  function removeDragHider() {
    document.body.removeChild(dragHider);
  }
</script>

<CssStoreRenderer />
<CurrViewStoreRenderer />

<div
  class="main"
  on:dragover|preventDefault
  style={`--gridColString: ${gridColString}; --gridRowString: ${gridRowString};`}
>
  <div class="topContainer bg-base-300">
    <slot name="topContainer">No topContainer</slot>
  </div>
  <div class=" bg-base-300 leftContainer">
    <slot name="leftContainer">No leftContainer</slot>
  </div>
  <div
    class="bg-base-300 leftDivider grababble"
    draggable="true"
    on:dblclick={toggleLeft}
    on:drag={dragLeft}
    on:dragstart={hideDragPreview}
    on:dragend={removeDragHider}
  >
    <!-- <slot name="leftDivider">No leftDivider</slot> -->
    &nbsp;
  </div>
  <div class="bg-base-300 mainContainer">
    <div class="h-full p-2 overflow-scroll rounded-sm bg-base-100 slot">
      <slot name="mainContainer">No mainContainer</slot>
    </div>
  </div>
  {#if canOpenRight}
    <div
      class="bg-base-300 rightDivider grababble"
      draggable="true"
      on:dblclick={toggleRight}
      on:drag={dragRight}
      on:dragstart={hideDragPreview}
      on:dragend={removeDragHider}
    >
      <!-- <slot name="rightDivider">No rightDivider</slot> -->
      &nbsp;
    </div>
    <div class="rightContainer">
      <slot name="rightContainer">No rightContainer</slot>
    </div>
  {/if}
  {#if canOpenBottom}
    <div
      class="bg-base-300 bottomDivider grababble"
      style="height: var(--bottomDividerHeight);"
      draggable="true"
      on:dblclick={toggleBottom}
      on:drag={dragBottom}
      on:dragstart={hideDragPreview}
      on:dragend={removeDragHider}
    >
      <slot name="bottomDivider">No bottomDivider</slot>
      &nbsp;
    </div>
    <div class="bottomContainer">
      <slot name="bottomContainer" />
    </div>
  {/if}
</div>

<style>
  :global(:root) {
    --dividerWidth: 1rem;
    --bottomDividerHeight: 2rem;
  }

  .main {
    display: grid;
    height: 100vh;
    overflow: hidden;
    grid-template-columns: var(--gridColString);
    grid-template-rows: var(--gridRowString);
  }

  .topContainer,
  .bottomDivider,
  .bottomContainer {
    grid-column: 1 / -1;
  }

  .leftContainer,
  .mainContainer,
  .rightContainer {
    /* Test with many items, possibly use this again but only add + var(--dividerWidth) if bottomContainer can be opened  */
    /* max-height: calc(
      100vh -
        calc(var(--topContainer) + var(--bottomContainer) + var(--dividerWidth))
    ); */
    overflow: scroll;
  }

  .leftContainer,
  .topContainer,
  .rightContainer,
  .bottomContainer,
  .mainContainer .slot {
    @apply p-2;
  }

  .topContainer {
    -webkit-app-region: drag;
  }

  .grababble:hover {
    cursor: -webkit-grab;
  }
  .grababble:active {
    cursor: -webkit-grabbing;
  }
</style>
