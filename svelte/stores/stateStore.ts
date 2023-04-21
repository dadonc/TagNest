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

export type FilteredTag = Tag & {
  totalCount: number;
  countAfterSelection: number;
  countAfterDeselection: number;
  isDeselected: boolean;
};

export const filteredData = derived(
  [selectedTags, items, allTags],
  async ([$selectedTags, $items, $allTags]) => {
    console.log("derived store");
    let filteredItems = await $items;
    const selectedTagIds = $selectedTags.selectedIds;
    const deselectedTagIds = $selectedTags.deselectedIds;
    if (selectedTagIds.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        let itemHasAllTags = true;
        selectedTagIds.forEach((tagId) => {
          if (!item.tags.some((tag) => tag.id === tagId)) {
            itemHasAllTags = false;
          }
        });
        return itemHasAllTags;
        // return item.tags.every((tag) => selectedTagIds.includes(tag.id));
      });
    }
    if (deselectedTagIds.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        return item.tags.every((tag) => !deselectedTagIds.includes(tag.id));
      });
    }

    const allTags = await $allTags;
    let filteredTags: FilteredTag[] = allTags
      .map((tag) => {
        const isDeselected = deselectedTagIds.includes(tag.id);
        let count = 0;
        filteredItems.forEach((item) => {
          if (item.tags.some((t) => t.id === tag.id)) {
            count++;
          }
        });

        return {
          ...tag,
          isDeselected,
          totalCount: count,
          countAfterSelection: filteredItems.length - count,
          countAfterDeselection: (count - filteredItems.length) * -1,
        };
      })
      .filter((tag) => tag.totalCount > 0 || tag.isDeselected);
    console.log(filteredTags);
    return {
      items: filteredItems,
      tags: filteredTags,
    };
  }
);
