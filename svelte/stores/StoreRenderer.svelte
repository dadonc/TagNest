<script lang="ts">
  import { onMount } from "svelte";
  import {
    leftContainer,
    rightContainer,
    bottomContainer,
    topContainer,
  } from "./cssStore";
  import type { CssContainerType } from "../Types";
  import { currView } from "./stateStore";
  import { deleteItemsStore, importItems } from "./items";
  import { pinBarHeight, pins } from "./pins";

  onMount(async () => {
    leftContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("leftContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--leftContainer",
        value.currentVal
      );
    });

    rightContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("rightContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--rightContainer",
        value.currentVal
      );
    });

    bottomContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("bottomContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--bottomContainer",
        value.currentVal
      );
    });

    topContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("topContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--topContainer",
        value.currentVal
      );
    });

    currView.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("currView", value);
    });

    importItems.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("importItems", value);
    });

    deleteItemsStore.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("deleteItems", value);
    });

    pins.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("pins", value);
    });

    pinBarHeight.subscribe((v) => {
      const value = JSON.stringify(v);
      localStorage.setItem("pinBarHeight", value);
    });
  });
</script>
