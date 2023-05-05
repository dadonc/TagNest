export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
export const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

type ItemType = "image" | "video" | "external";

export function getItemTypeFromExtension(
  extension: string | undefined
): ItemType {
  if (extension && IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
    return "image";
  }
  return "external";
}
