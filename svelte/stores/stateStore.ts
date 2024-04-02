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
};

const emptyCurrView: CurrViewType = {
  zoomLvl: 3,
  jumpToVideoTime: 0,
  viewType: "grid",
  orderDirection: "desc",
  orderBy: "createdAt",
  isItemDetailsOpen: false,
  isVideoDetailsOpen: false,
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
          if (a.name && b.name && a.name < b.name) {
            if ($currView.orderDirection === "asc") {
              return -1;
            }
            return 1;
          } else if (a.name && b.name && a.name > b.name) {
            if ($currView.orderDirection === "asc") {
              return 1;
            }
            return -1;
          }
        } else if ($currView.orderBy === "createdAt") {
          // get older date from file or item
          const a_olderCreatedAt =
            a.file && a.file.created < a.createdAt
              ? a.file.created
              : a.createdAt;
          const b_olderCreatedAt =
            b.file && b.file.created < b.createdAt
              ? b.file.created
              : b.createdAt;
          if (a_olderCreatedAt < b_olderCreatedAt) {
            if ($currView.orderDirection === "asc") {
              return -1;
            }
            return 1;
          } else if (a_olderCreatedAt > b_olderCreatedAt) {
            if ($currView.orderDirection === "asc") {
              return 1;
            }
            return -1;
          }
        } else if ($currView.orderBy === "updatedAt") {
          // get newer date from file or item
          const a_newerUpdatedAt =
            a.file && a.file.updated > a.updatedAt
              ? a.file.updated
              : a.updatedAt;
          const b_newerUpdatedAt =
            b.file && b.file.updated > b.updatedAt
              ? b.file.updated
              : b.updatedAt;
          if (a_newerUpdatedAt < b_newerUpdatedAt) {
            if ($currView.orderDirection === "asc") {
              return -1;
            }
            return 1;
          } else if (a_newerUpdatedAt > b_newerUpdatedAt) {
            if ($currView.orderDirection === "asc") {
              return 1;
            }
            return -1;
          }
        } else if ($currView.orderBy === "countOpened") {
          if (a.countOpened < b.countOpened) {
            if ($currView.orderDirection === "asc") {
              return -1;
            }
            return 1;
          } else if (a.countOpened > b.countOpened) {
            if ($currView.orderDirection === "asc") {
              return 1;
            }
            return -1;
          }
        } else if ($currView.orderBy === "fileSize") {
          if (!a.file || !b.file) {
            return 0;
          }
          if (a.file.size < b.file.size) {
            if ($currView.orderDirection === "asc") {
              return -1;
            }
            return 1;
          } else if (a.file.size > b.file.size) {
            if ($currView.orderDirection === "asc") {
              return 1;
            }
            return -1;
          }
        }
        return 0;
      });
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

type contextMenuStoreType = {
  x: number;
  y: number;
  isContextMenuOpen: boolean;
  openContextMenu: "items" | "tags" | "";
  isDeleteModalOpen: boolean;
  idsToDelete: string[];
  // todo do I need to store the modal type here?
  openModal:
    | "videoThumbnail"
    | "videoPreview"
    | "editItem"
    | "editItems"
    | "resetCounts"
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
};

export const contextMenuStore =
  writable<contextMenuStoreType>(emptyContextMenu);
