import { getItemTypeFromExtension } from "../../../../src/gschert";
import { type ItemCreate } from "../../../stores/items";
import { v4 as uuidv4 } from "uuid";

export default function createImportItems(paths: string[]): ItemCreate[] {
  const items = paths.map((path) => {
    const id = uuidv4();
    return {
      name: path.split("/").pop() ?? "",
      path,
      type: getItemTypeFromExtension(path.split(".").pop()),
      url: "",
      note: "",
      tagString: "",
      importStep: -1,
      id,
      tempId: id,
    };
  });
  return items;
}

export function createImportItem({
  path,
  name,
  url,
  note,
  tagString,
  type,
}: {
  path: string;
  name: string;
  url: string;
  note: string;
  tagString: string;
  type: string;
}): ItemCreate {
  const id = uuidv4();
  return {
    name,
    path,
    type,
    url,
    note,
    tagString,
    importStep: -1,
    id,
    tempId: id,
  };
}
