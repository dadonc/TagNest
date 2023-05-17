/*
  Warnings:

  - You are about to drop the column `framerate` on the `Video` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "aspectRatio" TEXT,
    "metaBitrate" TEXT,
    "bitrate" TEXT,
    "fps" INTEGER
);
INSERT INTO "new_Video" ("duration", "height", "id", "width") SELECT "duration", "height", "id", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
