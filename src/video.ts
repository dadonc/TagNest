import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { getSavePathJson } from "./utils";

const ffmpegPath = require("ffmpeg-static").replace(
  "app.asar",
  "app.asar.unpacked"
);
const ffprobePath = require("ffprobe-static").path.replace(
  "app.asar",
  "app.asar.unpacked"
);

const cutVideoSegment = (
  videoPath: string,
  savePath: string,
  startSecond: number,
  duration: number
): Promise<void> => {
  const fileName = videoPath.split("/").pop()?.split(".")[0];
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
      console.log("ERROR CATCHED", e);
      reject(e);
    }
  });
};

const concatVideo = (videoPath: string, savePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // ffmpeg -y -f concat -safe 0 -i cutPoints.txt -c copy output.wav
    // -y overwrites output file if it exists
    try {
      const fileType = videoPath.split(".").pop() || "mp4";
      const fileName = videoPath.split("/").pop()?.split(".")[0];
      const txtPath = path.join(savePath, fileName + "_cutPoints.txt");
      const outPath = path.join(savePath, fileName + "_preview." + fileType);
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
        // "-filter_complex",
        // "afade=t=out:st=1:overlap=1",
        outPath,
      ]);

      task.stderr.on("data", (data: string) => {});

      task.on("close", (code: string) => {
        if (code == "0") {
          resolve();
        } else reject();
      });
    } catch (e) {
      console.log("ERROR CATCHED", e);
      reject(e);
    }
  });
};

const getVideoDetails = (
  videoPath: string
): Promise<{
  duration: number;
  bitrate: string;
  info: string;
}> => {
  return new Promise((resolve, reject) => {
    const process = spawn(ffprobePath, [videoPath]);

    process.stderr.on("data", (d: string) => {
      const data = d.toString();
      if (data.indexOf("Duration:") !== -1) {
        try {
          const durationStr = data.split("Duration: ")[1].split(",")[0];
          let [h, m, s] = durationStr.split(":");
          s = s.split(".")[0];
          const duration = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
          const bitrate = data.split("bitrate: ")[1]?.split("\n")[0];
          const info = data.split("Video: ")[1]?.split("\n")[0];
          resolve({ duration, bitrate, info });
        } catch (e) {
          reject(e);
        }
      }
    });

    process.on("close", (code: string) => {
      if (code == "0") {
      } else reject();
    });
  });
};

const createConcatTxt = (
  videoPath: string,
  savePath: string,
  startSeconds: number[]
) => {
  const videoExtension = videoPath.split(".").pop();
  const fileName = videoPath.split("/").pop()?.split(".")[0];
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
  const fileName = videoPath.split("/").pop()?.split(".")[0];
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

export const createVideoPreview = async (videoPath: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const segmentDuration = 3; // seconds
      const segmentCount = 11; // segments plus one
      const details = await getVideoDetails(videoPath);
      console.log("got video details", details);
      const savePath = (await getSavePathJson()).savePath;
      const actualSegmentCount =
        details.duration > segmentCount * segmentDuration
          ? segmentCount
          : Math.ceil(segmentCount / 2);
      const slicePoints: number[] = [];
      let step = details.duration / actualSegmentCount;
      let curr = step;
      for (let i = 0; i < actualSegmentCount; i++) {
        slicePoints.push(curr);
        curr += step;
      }
      slicePoints.pop();
      for (const point of slicePoints) {
        await cutVideoSegment(videoPath, savePath, point, segmentDuration);
      }
      console.log("cut video");
      createConcatTxt(videoPath, savePath, slicePoints);
      console.log("created concat txt");
      await concatVideo(videoPath, savePath);
      console.log("concatted video");
      delTempFiles(videoPath, savePath, slicePoints);
      console.log("deleted temp files");
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
