export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg"];
export const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

type ItemType = "bookmark" | "image" | "video" | "pdf" | "external" | "noFile";

export type SettingsJson = {
  savePath: string;
  latestMigration: string;
  oldSavePath?: string;
  combineBehavior: "copy" | "move" | "separate";
};

export function getItemTypeFromExtension(
  extension: string | undefined
): ItemType {
  if (extension && IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
    return "image";
  } else if (extension && VIDEO_EXTENSIONS.includes(extension.toLowerCase())) {
    return "video";
  } else if (extension && extension.toLowerCase() === "pdf") {
    return "pdf";
  } else if (!extension) {
    return "noFile";
  }
  return "external";
}

export function extractNameAndExtension(filePath: string) {
  const name = filePath.split("/").pop()?.split(".").slice(0, -1).join(".");
  const extension = filePath.split(".").pop();
  return { name, extension };
}
