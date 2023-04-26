<script lang="ts">
  import { onMount } from "svelte";
  import {
    leftContainer,
    rightContainer,
    bottomContainer,
    topContainer,
  } from "./cssStore";
  import type { CssContainerType } from "../types";
  import { currView } from "./stateStore";

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
  });
</script>
