import { writable } from "svelte/store";
import prisma from "../prisma";
import type { SingleItem } from "./items";

export const allTags = writable<ReturnType<typeof getTags>>(getTags());

export async function getTags() {
  return prisma.tag.findMany();
}

async function createTag(name: string) {
  return prisma.tag.create({
    data: {
      name,
    },
  });
}

async function createTags(tagNames: string[]): Promise<string[]> {
  return await Promise.all(
    tagNames.map(async (tagName) => (await createTag(tagName)).id)
  );
}

async function possiblyDeleteTag(id: string) {
  const count = await prisma.item.count({
    where: {
      tags: {
        some: {
          id,
        },
      },
    },
  });
  if (count === 1) {
    return prisma.tag.delete({
      where: {
        id,
      },
    });
  }
}

async function possiblyDeleteTags(tagIds: string[]) {
  return await Promise.all(
    tagIds.map(async (tagId) => possiblyDeleteTag(tagId))
  );
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
  allTags.set(getTags());

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
