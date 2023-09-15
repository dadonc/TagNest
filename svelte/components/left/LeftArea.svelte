<script lang="ts">
  import {
    filteredData,
    type FilteredTag,
    type TagTree,
  } from "../../stores/stateStore";
  import LeftTagTree from "./LeftTagTree.svelte";

  export let tags: FilteredTag[];

  let tagTree = getTreeStructure(tags);
  $: $filteredData.then((data) => (tagTree = getTreeStructure(data.tags)));

  function getTreeStructure(tags: FilteredTag[]) {
    const tree: TagTree = {};

    for (const tag of tags) {
      const pathParts = tag.name.split(":").slice(0, -1);

      if (pathParts.length === 0) {
        if (!tree["_tags"]) {
          tree["_tags"] = [tag];
        } else {
          if (Array.isArray(tree["_tags"])) {
            tree["_tags"].push(tag);
          } else {
            console.error("Expected tree['_tags'] to be an array");
          }
        }
        continue;
      }

      let currentNode: any = tree;

      for (const part of pathParts) {
        if (!currentNode[part]) {
          currentNode[part] = {};
        }
        currentNode = currentNode[part];
      }
      if (!currentNode["_tags"]) {
        currentNode["_tags"] = [tag];
      } else {
        currentNode["_tags"].push(tag);
      }
    }

    return tree;
  }
</script>

<LeftTagTree {tagTree} indent={0} />
