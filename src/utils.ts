import https from "https";
import fs from "fs";

export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
export const VIDEO_EXTENSIONS = ["mp4", "m4v", "mpg", "mpeg", "ogg", "webm"];

type ItemType = "image" | "video" | "external";

export function getTypeFromExtension(extension: string | undefined): ItemType {
  if (extension && IMAGE_EXTENSIONS.includes(extension)) {
    return "image";
  }
  return "external";
}

export function downloadImageFromUrl(
  url: string,
  dest: string,
  cb: (res: any) => void
) {
  //https://stackoverflow.com/a/22907134
  var file = fs.createWriteStream(dest);
  https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(cb);
      });
    })
    .on("error", function (err) {
      fs.unlink(dest, () => {});
      if (cb) cb(err.message);
    });
}
