import { getItemTypeFromExtension } from "../../../../src/gschert";
import { createItem } from "../../../stores/items";

export default function createImportItems(paths: string[]) {
  const items = paths.map((path) => {
    return {
      name: path.split("/").pop() ?? "",
      path,
      type: getItemTypeFromExtension(path.split(".").pop()),
      getsCurrentlyImported: true,
      url: "",
      note: "",
      tagString: "",
      importStep: -1,
    };
  });
  return Promise.all(items.map(async (item) => await createItem(item)));
}
