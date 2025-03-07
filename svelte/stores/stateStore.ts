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

type CurrViewType = {
  zoomLvl: number;
  zoomLvlDetails: number;
  jumpToVideoTime?: number; // used to directly jump to a specific timestamp in the video if user clicks on the seekbar of a video in the gridview
  viewType: "grid" | "list";
  orderDirection: "desc" | "asc";
  orderBy:
    | "createdAt"
    | "updatedAt"
    | "name"
    | "fileSize"
    | "countOpened"
    | "shuffle";
  isItemDetailsOpen: boolean;
  isVideoDetailsOpen: boolean;
  searchString: string;
};

const emptyCurrView: CurrViewType = {
  zoomLvl: 4,
  zoomLvlDetails: 5,
  jumpToVideoTime: 0,
  viewType: "grid",
  orderDirection: "desc",
  orderBy: "createdAt",
  isItemDetailsOpen: false,
  isVideoDetailsOpen: false,
  searchString: "",
};

const currentCurrView = localStorage.getItem("currView");
export const currView = writable<CurrViewType>(
  currentCurrView ? JSON.parse(currentCurrView) : emptyCurrView
);

export const filteredData = derived(
  [selectedTags, items, allTags, currView],
  async ([$selectedTags, $items, $allTags, $currView]) => {
    let filteredItems = $items;
    const selectedTagIds = $selectedTags.selectedIds;
    const deselectedTagIds = $selectedTags.deselectedIds;
    if (selectedTagIds.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        let itemHasAllTags = selectedTagIds.every((tagId) => {
          return item.tags.some((tag) => tag.id === tagId);
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

    // sort tags by count
    filteredTags = filteredTags.sort((a, b) => {
      if (a.countAfterSelection < b.countAfterSelection) {
        return -1;
      } else if (a.countAfterSelection > b.countAfterSelection) {
        return 1;
      } else if (a.countAfterDeselection == b.countAfterDeselection) {
        if (a.countAfterDeselection < b.countAfterDeselection) {
          return -1;
        } else if (a.countAfterDeselection > b.countAfterDeselection) {
          return 1;
        }
      }
      return 0;
    });

    // deselect items if currently selected items are not in the filtered items
    selectedItems.update((selectedItems) => {
      return {
        ids: selectedItems.ids.filter((id) =>
          filteredItems.some((item) => item.id === id)
        ),
      };
    });

    // order items by the current selected order
    if ($currView.orderBy !== "shuffle") {
      filteredItems = filteredItems.sort((a, b) => {
        if ($currView.orderBy === "name") {
          if (!a.name && !b.name) return 0;
          if (!a.name) return $currView.orderDirection === "asc" ? 1 : -1;
          if (!b.name) return $currView.orderDirection === "asc" ? -1 : 1;
          const comparison = a.name.localeCompare(b.name);
          return $currView.orderDirection === "asc" ? -comparison : comparison;
        } else if ($currView.orderBy === "createdAt") {
          // Get the older date from file or item
          const a_olderCreatedAt =
            a.file && a.file.created < a.createdAt
              ? a.file.created
              : a.createdAt;
          const b_olderCreatedAt =
            b.file && b.file.created < b.createdAt
              ? b.file.created
              : b.createdAt;
          const comparison =
            Number(new Date(a_olderCreatedAt)) -
            Number(new Date(b_olderCreatedAt));
          return $currView.orderDirection === "asc" ? comparison : -comparison;
        } else if ($currView.orderBy === "updatedAt") {
          const a_newerUpdatedAt =
            a.file && a.file.updated > a.updatedAt
              ? a.file.updated
              : a.updatedAt;
          const b_newerUpdatedAt =
            b.file && b.file.updated > b.updatedAt
              ? b.file.updated
              : b.updatedAt;
          const comparison =
            Number(new Date(a_newerUpdatedAt)) -
            Number(new Date(b_newerUpdatedAt));
          return $currView.orderDirection === "asc" ? comparison : -comparison;
        } else if ($currView.orderBy === "countOpened") {
          const comparison = a.countOpened - b.countOpened;
          return $currView.orderDirection === "asc" ? comparison : -comparison;
        } else if ($currView.orderBy === "fileSize") {
          if (!a.file || !b.file) return 0;
          const comparison = Number(a.file.size) - Number(b.file.size);
          return $currView.orderDirection === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    }
    if ($currView.searchString) {
      filteredItems = filteredItems.filter((item) =>
        item.name?.toLowerCase().includes($currView.searchString.toLowerCase())
      );
    }

    return {
      items: filteredItems,
      tags: filteredTags,
    };
  }
);

type Route = "main" | "details" | "importMultiple" | "settings";
export const currentRoute = writable<Route>("main");

export const settingsJson = writable<SettingsJson>();

export type possibleContextMenus =
  | "items"
  | "tags"
  | "videoSeekbar"
  | "videoMark"
  | "pin";

type contextMenuStoreType = {
  x: number;
  y: number;

  // todo remove, move into openContextMenu
  isContextMenuOpen: boolean;
  openContextMenu: possibleContextMenus | "";
  triggeredByTagId: string; // tag which was clicked to trigger the context menu
  videoSeekPos: number; // position in the seek bar the user has clicked to open the context menu
  triggeredByMarkId: string; // mark which was clicked to trigger the context menu
  triggeredByPinItemId: string; // pin which was clicked to trigger the context menu
  // todo remove - move this into openModal
  isDeleteModalOpen: boolean;
  idsToDelete: string[];
  openModal:
    | "videoThumbnail"
    | "videoPreview"
    | "editItem"
    | "editItems"
    | "resetCounts"
    | "renameTag"
    | "deleteTag"
    | "welcome"
    | "";
};

const emptyContextMenu: contextMenuStoreType = {
  x: 0,
  y: 0,
  isDeleteModalOpen: false,
  isContextMenuOpen: false,
  idsToDelete: [],
  openModal: "",
  openContextMenu: "",
  triggeredByTagId: "",
  triggeredByMarkId: "",
  triggeredByPinItemId: "",
  videoSeekPos: 0,
};

export const contextMenuStore =
  writable<contextMenuStoreType>(emptyContextMenu);
