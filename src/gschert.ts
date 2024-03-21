export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg"];
const VIDEO_EXTENSIONS = [
  "mp4",
  "mpg",
  "mpeg",
  "ogg",
  "webm",
  "3gp",
  // "m4v",
  // "mov",
  // "avi",
];
const AUDIO_EXTENSIONS = ["mp3", "wav", "flac", "ogg", "m4a"];
const TEXT_EXTENSIONS = ["txt", "md"];

type ItemType =
  | "bookmark"
  | "image"
  | "video"
  | "pdf"
  | "external"
  | "noFile"
  | "audio"
  | "text";

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
  } else if (extension && AUDIO_EXTENSIONS.includes(extension.toLowerCase())) {
    return "audio";
  } else if (extension && TEXT_EXTENSIONS.includes(extension.toLowerCase())) {
    return "text";
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
