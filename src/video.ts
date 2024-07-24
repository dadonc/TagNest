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
    // Example output: width=1920,height=1080,duration=300.000000,display_aspect_ratio=16:9,bit_rate=5000000,avg_frame_rate=25/1
    const entries = data.split("\n");
    const result: any = {};
    entries.forEach((entry) => {
      const [key, value] = entry.split("=");
      result[key] = value;
    });
    return {
      width: Math.round(Number(result.width)),
      height: Math.round(Number(result.height)),
      duration: Math.round(Number(result.duration)),
      aspectRatio: result.display_aspect_ratio,
      // TODO should this be a number?
      metaBitrate: String(Math.round(Number(result.bit_rate))),
      bitrate: String(Math.round(Number(result.bit_rate))),
      fps: eval(result.avg_frame_rate), // This converts avg_frame_rate from "25/1" to 25
    };
  }

  return new Promise((resolve, reject) => {
    try {
      const process = spawn(ffprobePath, [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,duration,display_aspect_ratio,bit_rate,avg_frame_rate",
        "-of",
        "default=noprint_wrappers=1:nokey=0",
        videoPath,
      ]);

      let data = "";

      process.stdout.on("data", (d: Buffer) => {
        data += d.toString();
      });

      process.stderr.on("data", (d: Buffer) => {
        data += d.toString();
        console.error("stderr: ", d.toString());
      });

      process.on("close", (code: number) => {
        if (code === 0) {
          const result = extractData(data.trim());
          resolve(result);
        } else {
          reject(new Error(`ffprobe process exited with code ${code}`));
        }
      });
    } catch (e) {
      console.log("ERROR CATCHED in function getVideoDetails", e);
      reject(e);
    }
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
