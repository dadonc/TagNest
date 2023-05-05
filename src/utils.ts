import https from "https";
import path from "path";
import fs from "fs";

// todo remove, and use promisified version, see below
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

export function downloadImageFromUrlPromisified(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    //https://stackoverflow.com/a/22907134
    var file = fs.createWriteStream(dest);
    return https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close(() => resolve(true));
        });
      })
      .on("error", function (err) {
        fs.unlink(dest, () => {});
        console.error(err);
        reject(err);
      });
  });
}

export async function downloadImageAsBase64FromUrl(url: string) {
  const extension = url.split(".").pop();
  const tempPath = path.join(process.resourcesPath, "temp." + extension);
  return new Promise<string>((resolve, reject) => {
    downloadImageFromUrl(url, tempPath, (err) => {
      if (err) {
        reject(err);
      }
      const base64 = fs.readFileSync(tempPath, "base64");
      fs.unlinkSync(tempPath);
      resolve(`data:image/${extension};base64,${base64}`);
    });
  });
}
