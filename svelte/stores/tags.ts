import { writable } from "svelte/store";
import prisma from "../prisma";
import type { SingleItem } from "./items";
import { selectedTags } from "./stateStore";

export const allTags = writable<ReturnType<typeof getTags>>(getTags());

function refreshTagsStore() {
  allTags.set(getTags());
}

export async function getTags() {
  return prisma.tag.findMany();
}

async function createTag({
  name,
  dontRefreshStore,
}: {
  name: string;
  dontRefreshStore?: boolean;
}) {
  const newTag = await prisma.tag.create({
    data: {
      name,
    },
  });
  if (!dontRefreshStore) refreshTagsStore();
  return newTag;
}

async function createTags(tagNames: string[]) {
  const newIds = await Promise.all(
    tagNames.map(
      async (tagName) =>
        (
          await createTag({ name: tagName, dontRefreshStore: true })
        ).id
    )
  );
  refreshTagsStore();
  return newIds;
}

async function possiblyDeleteTag({
  id,
  dontRefreshStore,
}: {
  id: string;
  dontRefreshStore?: boolean;
}) {
  const count = await prisma.item.count({
    where: {
      tags: {
        some: {
          id,
        },
      },
    },
  });
  if (count === 0) {
    const deleted = await prisma.tag.delete({
      where: {
        id,
      },
    });
    if (!dontRefreshStore) {
      refreshTagsStore();

      selectedTags.update((tags) => {
        const selectedIds = tags.selectedIds.filter((id) => id !== deleted.id);
        const deselectedIds = tags.deselectedIds.filter(
          (id) => id !== deleted.id
        );
        return {
          selectedIds,
          deselectedIds,
        };
      });
    }
    return deleted;
  }
}

export async function possiblyDeleteTags(tagIds: string[]) {
  const deletedTags = await Promise.all(
    tagIds.map((tagId) =>
      possiblyDeleteTag({ id: tagId, dontRefreshStore: true })
    )
  );
  refreshTagsStore();
  return deletedTags;
}

export async function updateItemTags(item: SingleItem, tagString: string) {
  const tagNames = tagString.split(",").map((tag) => tag.trim());
  const tags = await prisma.tag.findMany({
    where: {
      name: {
        in: tagNames,
      },
    },
  });

  // Delete tags that are no longer used
  const deletedTags = item.tags.filter(
    (oldTag) => !tagNames.some((tag) => tag === oldTag.name)
  );
  const deletedTagIds = deletedTags.map((tag) => tag.id);
  await possiblyDeleteTags(deletedTagIds);

  // Create new tags
  const newTagNames = tagNames.filter(
    (tagName) => !tags.some((tag) => tag.name === tagName)
  );
  const newTagIds = await createTags(newTagNames);
  const existingTagIds = tags.map((tag) => tag.id);

  // Update the store
  refreshTagsStore();

  // Connect all tags to the item
  const allTagIds = [...newTagIds, ...existingTagIds];
  return prisma.item.update({
    where: {
      id: item.id,
    },
    data: {
      tags: {
        connect: allTagIds.map((id) => ({ id })),
      },
    },
  });
}
