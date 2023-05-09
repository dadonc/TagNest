export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
export const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

type ItemType = "bookmark" | "image" | "video" | "pdf" | "external";

export function getItemTypeFromExtension(
  extension: string | undefined
): ItemType {
  if (extension && IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
    return "image";
  } else if (extension && VIDEO_EXTENSIONS.includes(extension.toLowerCase())) {
    return "video";
  } else if (extension && extension.toLowerCase() === "pdf") {
    return "pdf";
  }
  return "external";
}
