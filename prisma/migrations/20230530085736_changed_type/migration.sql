/*
  Warnings:

  - You are about to alter the column `fps` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

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
    "fps" REAL
);
INSERT INTO "new_Video" ("aspectRatio", "bitrate", "duration", "fps", "height", "id", "metaBitrate", "width") SELECT "aspectRatio", "bitrate", "duration", "fps", "height", "id", "metaBitrate", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
