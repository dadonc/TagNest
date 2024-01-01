import { derived, writable } from "svelte/store";
import { items } from "./items";
import { allTags } from "./tags";
import type { Tag } from "@prisma/client";
import type { SettingsJson } from "../../src/gschert";

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

export type TagTree = {
  [key: string]: FilteredTag[] | TagTree;
};

export const filteredData = derived(
  [selectedTags, items, allTags],
  async ([$selectedTags, $items, $allTags]) => {
    let filteredItems = $items;
    const selectedTagIds = $selectedTags.selectedIds;
    const deselectedTagIds = $selectedTags.deselectedIds;
    if (selectedTagIds.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        let itemHasAllTags = true;
        selectedTagIds.every((tagId) => {
          if (!item.tags.some((tag) => tag.id === tagId)) {
            itemHasAllTags = false;
            return false;
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

    const allTags = $allTags;
    let filteredTags: FilteredTag[] = allTags
      .map((tag) => {
        const isDeselected = deselectedTagIds.includes(tag.id);
        let count = 0;
        filteredItems.forEach((item) => {
          if (item.tags.some((t) => t.id === tag.id)) {
            count++;
          }
        });

        const countAfterDeselect =
          filteredItems.length -
          (filteredItems.length + (count - filteredItems.length));

        return {
          ...tag,
          isDeselected,
          totalCount: count,
          countAfterSelection: filteredItems.length - count,
          countAfterDeselection:
            countAfterDeselect - filteredItems.length === 0
              ? 0
              : countAfterDeselect,
        };
      })
      .filter((tag) => tag.totalCount > 0 || tag.isDeselected);

    // deselect items if currently selected items are not in the filtered items
    selectedItems.update((selectedItems) => {
      return {
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
  // selectionType: "grid";
  // detailsType: CurrViewDetailsType;
  // focusedAction?: CurrViewActionsType;
};

const emptyCurrView: CurrViewType = {
  zoomLvl: 3,
  // selectionType: "grid",
  // detailsType: "image",
};

const currentCurrView = localStorage.getItem("currView");
export const currView = writable<CurrViewType>(
  currentCurrView ? JSON.parse(currentCurrView) : emptyCurrView
);

type Route = "main" | "details" | "importMultiple" | "settings";
export const currentRoute = writable<Route>("main");

export const settingsJson = writable<SettingsJson>();

type contextMenuStoreType = {
  x: number;
  y: number;
  isContextMenuOpen: boolean;
};

const emptyContextMenu: contextMenuStoreType = {
  x: 0,
  y: 0,
  isContextMenuOpen: false,
};

export const contextMenuStore =
  writable<contextMenuStoreType>(emptyContextMenu);
