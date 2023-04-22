import { writable } from "svelte/store";
import prisma from "../prisma";
import type { SingleItem } from "./items";
import { selectedTags } from "./stateStore";

export const allTags = writable<ReturnType<typeof getTags>>(getTags());

function refreshTagsStore(src?: string) {
  console.log("Refreshing tags store", src);
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
  refreshTagsStore("createTags");
  return newIds;
}

async function possiblyDeleteSingleTag({
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
      refreshTagsStore("possiblyDeleteSingleTag");

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
      possiblyDeleteSingleTag({ id: tagId, dontRefreshStore: true })
    )
  );
  refreshTagsStore("possiblyDeleteTags");
  return deletedTags;
}

export async function updateItemTags(item: SingleItem, tagString: string) {
  const tagNames = tagString
    .split(",")
    .map((tag) => tag.trim())
    .filter((t) => Boolean(t) && t != "&nbsp;");
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

  // Create new tags
  const newTagNames = tagNames.filter(
    (tagName) => !tags.some((tag) => tag.name === tagName)
  );
  const newTagIds = await createTags(newTagNames);

  // Link newly added, but previously created tags
  const allTags = [...tags.map((tag) => tag.id), ...newTagIds];

  // Update item tags
  await prisma.item.update({
    where: {
      id: item.id,
    },
    data: {
      tags: {
        connect: allTags.map((id) => ({ id })),
        disconnect: deletedTagIds.map((id) => ({ id })),
      },
    },
  });

  await possiblyDeleteTags(deletedTagIds);
}

export async function updateItemsTags(itemIds: string[], tagString: string) {
  // if this takes long implement "dontRefreshStore"
  const items = await prisma.item.findMany({
    where: {
      id: {
        in: itemIds,
      },
    },
    include: {
      tags: true,
      file: true,
    },
  });
  // Don't use Promise.all because tags should be created before the next item gets processed
  for (const item of items) {
    await updateItemTags(item, tagString);
  }
}
