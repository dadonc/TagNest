export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// !!!IMPORTANT!!! This is duplicated inside src/main.js
// TODO: Find a way to share this between the two
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

type ItemType = "image" | "video" | "external";
export function getTypeFromExtension(extension: string): ItemType {
  if (IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }
  return "external";
}
