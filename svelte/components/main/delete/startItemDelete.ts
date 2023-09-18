import { get } from "svelte/store";
import { deleteItemsStore, items } from "../../../stores/items";
import { startDeleteTasks } from "./DeleteQueue";

export async function addToDeleteQueue(ids: string[]) {
  const $deleteItems = get(deleteItemsStore);
  const $items = get(items);
  const itemsToDelete = $items.filter((item) => ids.includes(item.id));
  itemsToDelete.forEach((item) => {
    if (!$deleteItems.some((deleteItem) => deleteItem.id === item.id)) {
      $deleteItems.push({
        ...item,
        deleteStep: 0,
      });
    }
  });
  startDeleteTasks();
}
