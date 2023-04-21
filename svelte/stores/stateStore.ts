import { derived, writable } from "svelte/store";
import { items } from "./items";
import { allTags } from "./tags";
import type { Tag } from "@prisma/client";

export const state = writable<{
  selectedItems: string[];
}>({
  selectedItems: [],
});

export const selectedTags = writable<{
  selectedIds: string[];
  deselectedIds: string[];
}>({
  selectedIds: [],
  deselectedIds: [],
});

// export const selectedTags = writable<string[]>([]);
// export const deSelectedTags = writable<string[]>([]);

export type FilteredTag = Tag & { count: number };

export const filteredData = derived(
  [selectedTags, items, allTags],
  async ([$selectedTags, $items, $allTags]) => {
    console.log("derived store");
    let filteredItems = await $items;
    const selectedTagIds = $selectedTags.selectedIds;
    const deselectedTagIds = $selectedTags.deselectedIds;
    if (!(selectedTagIds.length === 0)) {
      filteredItems = filteredItems.filter((item) => {
        return item.tags.some((tag) => selectedTagIds.includes(tag.id));
      });
    }
    if (!(deselectedTagIds.length === 0)) {
      filteredItems = filteredItems.filter((item) => {
        return item.tags.every((tag) => !deselectedTagIds.includes(tag.id));
      });
    }

    const allTags = await $allTags;
    let filteredTags: FilteredTag[] = allTags
      .map((tag) => {
        let count = 0;
        filteredItems.forEach((item) => {
          if (item.tags.some((t) => t.id === tag.id)) {
            count++;
          }
        });
        return { ...tag, count };
      })
      .filter((tag) => tag.count > 0);

    return {
      items: filteredItems,
      tags: filteredTags,
    };
  }
);
