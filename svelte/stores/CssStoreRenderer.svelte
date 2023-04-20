<script lang="ts">
  import { onMount } from "svelte";
  import {
    leftContainer,
    rightContainer,
    bottomContainer,
    topContainer,
  } from "./CssStore";
  import type { CssContainerType } from "../types";

  onMount(async () => {
    const left = localStorage.getItem("leftContainer");
    $leftContainer = left
      ? JSON.parse(left)
      : {
          val: "200px",
          currentVal: "200px",
        };
    leftContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("leftContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--leftContainer",
        value.currentVal
      );
    });

    const right = localStorage.getItem("rightContainer");
    $rightContainer = right
      ? JSON.parse(right)
      : {
          val: "200px",
          currentVal: "200px",
        };
    rightContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("rightContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--rightContainer",
        value.currentVal
      );
    });

    const bottom = localStorage.getItem("bottomContainer");
    $bottomContainer = bottom
      ? JSON.parse(bottom)
      : {
          val: "200px",
          currentVal: "200px",
        };
    bottomContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("bottomContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--bottomContainer",
        value.currentVal
      );
    });

    const top = localStorage.getItem("topContainer");
    $topContainer = top
      ? JSON.parse(top)
      : {
          val: "3.5rem",
          currentVal: "3.5rem",
        };
    topContainer.subscribe((v) => {
      const value = v as CssContainerType;
      localStorage.setItem("topContainer", JSON.stringify(value));
      document.documentElement.style.setProperty(
        "--topContainer",
        value.currentVal
      );
    });
  });
</script>
