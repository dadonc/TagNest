import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { getSettingsJson } from "./utils";
import { extractNameAndExtension } from "./gschert";
import { getPrismaClient } from "./prisma";

const ffmpegPath = require("ffmpeg-static").replace(
  "app.asar",
  "app.asar.unpacked"
);
const ffprobePath = require("ffprobe-static").path.replace(
  "app.asar",
  "app.asar.unpacked"
);

const escapeFileName = (name: string) => {
  //@ts-ignore
  let fileName = name.replaceAll("`", "__--__--__");
  //@ts-ignore
  fileName = fileName.replaceAll("'", "__--__--__");
  return fileName;
};

const unescapeFileName = (name: string) => {
  //@ts-ignore
  let fileName = name.replaceAll("__--__--__", "'");
  return fileName;
};

const cutVideoSegment = (
  videoPath: string,
  savePath: string,
  startSecond: number,
  duration: number
): Promise<void> => {
  let fileName = extractNameAndExtension(videoPath).name || "";
  fileName = escapeFileName(fileName);
  if (!fileName) throw new Error("Invalid videoPath");
  return new Promise((resolve, reject) => {
    try {
      // ffmpeg -y -ss 30 -i input.mp4 -c copy -t 10 output.mp4
      // -y overwrites output videoPath if it exists
      const fileType = videoPath.split(".").pop() || "mp4";
      const outName = fileName + "_" + startSecond + "_cut." + fileType;
      const outPath = path.join(savePath, outName);
      const task = spawn(ffmpegPath, [
        "-y",
        "-ss",
        startSecond.toString(),
        "-i",
        videoPath,
        "-c",
        "copy",
        "-t",
        duration.toString(),
        outPath,
      ]);

      task.stderr.on("data", (data: string) => {});

      task.on("close", (code: string) => {
        if (code == "0") {
          resolve();
        } else reject();
      });
    } catch (e) {
      console.log("ERROR CATCHED in function cutVideoSegment", e);
      reject(e);
    }
  });
};

const concatVideo = (
  videoPath: string,
  savePath: string,
  tempPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // ffmpeg -y -f concat -safe 0 -i cutPoints.txt -c copy output.wav
    // -y overwrites output file if it exists
    try {
      const fileType = videoPath.split(".").pop() || "mp4";
      let fileName = extractNameAndExtension(videoPath).name || "";
      fileName = escapeFileName(fileName);
      const txtPath = path.join(tempPath, fileName + "_cutPoints.txt");
      const outDir = path.join(savePath, "previews", "videos");
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(path.join(savePath, "previews"));
        fs.mkdirSync(path.join(savePath, "previews", "videos"));
      }
      const outPath = path.join(
        outDir,
        fileName + "_preview_flicker." + fileType
      );
      const task = spawn(ffmpegPath, [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        txtPath,
        "-c",
        "copy",
        outPath,
      ]);

      task.stderr.on("data", (data: string) => {});

      task.on("exit", async (code: string) => {
        if (code == "0") {
          await deflicker(outPath);
          resolve();
        } else reject();
      });
    } catch (e) {
      console.log("ERROR CATCHED in function concatVideo", e);
      reject(e);
    }
  });
};

function deflicker(previewPath: string): Promise<void> {
  // ffmpeg -i input.mp4 -vf deflicker output.mp4
  return new Promise((resolve, reject) => {
    const task = spawn(ffmpegPath, [
      "-y", // overwrite output file if it exists
      "-i",
      previewPath,
      "-vf",
      "deflicker",
      unescapeFileName(previewPath.replace("_flicker", "")),
    ]);
    task.on("exit", (code: string) => {
      if (code == "0") {
        fs.unlink(previewPath, () => resolve());
      } else reject();
    });
  });
}

// const getSomeVideoDetails = (
//   videoPath: string
// ): Promise<{
//   duration: number;
//   bitrate: string;
//   info: string;
// }> => {
//   return new Promise((resolve, reject) => {
//     const process = spawn(ffprobePath, [videoPath]);

//     process.stderr.on("data", (d: string) => {
//       const data = d.toString();
//       if (data.indexOf("Duration:") !== -1) {
//         try {
//           const durationStr = data.split("Duration: ")[1].split(",")[0];
//           let [h, m, s] = durationStr.split(":");
//           s = s.split(".")[0];
//           const duration = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
//           const bitrate = data.split("bitrate: ")[1]?.split("\n")[0];
//           const info = data.split("Video: ")[1]?.split("\n")[0];
//           resolve({ duration, bitrate, info });
//         } catch (e) {
//           reject(e);
//         }
//       }
//     });

//     process.on("close", (code: string) => {
//       if (code == "0") {
//       } else reject();
//     });
//   });
// };

const createConcatTxt = (
  videoPath: string,
  savePath: string,
  startSeconds: number[]
) => {
  const videoExtension = videoPath.split(".").pop();
  let fileName = extractNameAndExtension(videoPath).name || "";
  fileName = escapeFileName(fileName);
  if (!fileName) throw new Error("Invalid videoPath");
  const txt = startSeconds
    .map(
      (s) =>
        `file '${path.join(
          savePath,
          `${fileName}_${s}_cut.${videoExtension}`
        )}'`
    )
    .join("\n");
  fs.writeFileSync(path.join(savePath, fileName + "_cutPoints.txt"), txt);
};

const delTempFiles = (
  videoPath: string,
  savePath: string,
  startSeconds: number[]
) => {
  let fileName = extractNameAndExtension(videoPath).name || "";
  fileName = escapeFileName(fileName);
  if (!fileName) throw new Error("Invalid videoPath");
  const videoExtension = videoPath.split(".").pop();
  startSeconds.forEach((s) =>
    fs.unlink(
      path.join(savePath, `${fileName}_${s}_cut.${videoExtension}`),
      () => {}
    )
  );
  const txtPath = path.join(savePath, `${fileName}_cutPoints.txt`);
  fs.unlink(txtPath, () => {});
};

export const createVideoPreview = async (
  videoPath: string,
  offset?: number
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const segmentDuration = 2; // seconds
      const segmentCount = 11; // segments plus one
      const startOffset = offset ? offset : 30;
      const details = await getVideoDetails(videoPath);
      const savePath = (await getSettingsJson()).savePath;
      const actualSegmentCount =
        details.duration - startOffset > segmentCount * segmentDuration
          ? segmentCount
          : segmentCount / 2;
      const slicePoints: number[] = [];
      let step = (details.duration - startOffset) / actualSegmentCount;
      let curr = startOffset;
      for (let i = 0; i < actualSegmentCount; i++) {
        slicePoints.push(Math.floor(curr));
        curr += step;
      }
      const tempPath = path.join(savePath, "temp");
      if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
      slicePoints.pop();
      for (const point of slicePoints) {
        await cutVideoSegment(videoPath, tempPath, point, segmentDuration);
      }
      createConcatTxt(videoPath, tempPath, slicePoints);
      await concatVideo(videoPath, savePath, tempPath);
      delTempFiles(videoPath, tempPath, slicePoints);
      resolve();
    } catch (e) {
      console.log("ERROR CATCHED in function createVideoPreview", e);
      reject(e);
    }
  });
};

type VideoDetails = {
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
  metaBitrate: string;
  bitrate: string;
  fps: number;
};

export const getVideoDetails = (videoPath: string): Promise<VideoDetails> => {
  function extractData(data: string) {
    let result: VideoDetails = {} as any;
    if (data.indexOf("Duration:") !== -1) {
      const durationStr = data.split("Duration: ")[1].split(",")[0];
      let [h, m, s] = durationStr.split(":");
      s = s.split(".")[0];
      result["duration"] = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    }
    if (data.indexOf("bitrate: ") !== -1) {
      result["metaBitrate"] = data.split("bitrate: ")[1]?.split("\n")[0];
    }
    if (data.indexOf("Stream #0:0") !== -1) {
      const i = data.split("Stream")[1]?.split("\n")[0];
      //Example for i:  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720 [SAR 1:1 DAR 16:9], 619 kb/s, 30 fps, 30 tbr, 15360 tbn, 60 tbc (default)
      if (i) {
        i.split(", ").forEach((s) => {
          if (s.indexOf("kb/s") !== -1) {
            if (!result["bitrate"])
              result["bitrate"] = s.split("kb/s")[0].trim() + "kb/s"; // rmv (default) or (forced) if present
          } else if (s.indexOf("DAR") !== -1) {
            if (!result["aspectRatio"])
              result["aspectRatio"] = s.split("DAR ")[1].slice(0, -1);
            if (!result["width"])
              result["width"] = Number(s.split("x")[0].trim());
            if (!result["height"])
              result["height"] = Number(s.split("x")[1].split(" ")[0].trim());
          } else if (s.indexOf("fps") !== -1) {
            if (!result["fps"]) result["fps"] = Number(s.split(" ")[0].trim());
          }
        });
      }
    }
    return result;
  }

  return new Promise((resolve, reject) => {
    const process = spawn(ffprobePath, [videoPath]);
    let data = "";
    process.stderr.on("data", (d: string) => {
      const stdData = d.toString();
      data += stdData;
    });

    process.on("close", (code: string) => {
      if (code == "0") {
        const result = extractData(data);
        resolve(result);
      } else reject();
    });
  });
};

export async function saveVideoDetailsToItem(
  videoPath: string,
  itemId: string
) {
  const details = await getVideoDetails(videoPath);
  const prisma = await getPrismaClient();
  await prisma.video.create({
    data: {
      ...details,
      item: {
        connect: {
          id: itemId,
        },
      },
    },
  });
}

async function getAudioLength(audioPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // https://stackoverflow.com/a/22243834
    const process = spawn(ffprobePath, [
      "-i",
      audioPath,
      "-show_entries",
      "format=duration",
      "-v",
      "quiet",
    ]);
    let duration = "";
    process.stdout.on("data", (d: string) => {
      duration = d.toString().slice(d.indexOf("=") + 1, d.indexOf("\n["));
    });

    process.on("close", (code: string, d: string) => {
      if (code == "0") {
        resolve(Number(duration));
      } else reject();
    });
  });
}

export async function saveAudioLengthToItem(audioPath: string, itemId: string) {
  const duration = await getAudioLength(audioPath);
  const prisma = await getPrismaClient();
  return await prisma.audio.create({
    data: {
      duration,
      item: {
        connect: {
          id: itemId,
        },
      },
    },
  });
}
