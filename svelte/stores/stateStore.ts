import { derived, writable } from "svelte/store";
import { items } from "./items";
import { allTags } from "./tags";
import type { Tag } from "@prisma/client";

export const selectedItems = writable<{
  ids: string[];
}>({
  ids: [],
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
          countAfterDeselection:
            filteredItems.length - count === 0
              ? 0
              : filteredItems.length - (count - filteredItems.length) * -1,
        };
      })
      .filter((tag) => tag.totalCount > 0 || tag.isDeselected);

    // deselect items if currently selected items are not in the filtered items
    selectedItems.update((selectedItems) => {
      return {
        ...selectedItems,
        ids: selectedItems.ids.filter((id) =>
          filteredItems.some((item) => item.id === id)
        ),
      };
    });
    return {
      items: filteredItems,
      tags: filteredTags,
    };
  }
);

type CurrViewType = {
  zoomLvl: number;
  // TODO move into antoher store that doesn't get saved in local storage
  route: "main" | "details" | "importMultiple";
  // selectionType: "grid";
  // detailsType: CurrViewDetailsType;
  // focusedAction?: CurrViewActionsType;
};

const emptyCurrView: CurrViewType = {
  zoomLvl: 3,
  route: "main",
  // selectionType: "grid",
  // detailsType: "image",
};

const currentCurrView = localStorage.getItem("currView");
export const currView = writable<CurrViewType>(
  currentCurrView ? JSON.parse(currentCurrView) : emptyCurrView
);
