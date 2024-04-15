/*
  Warnings:

  - You are about to drop the column `audioId` on the `VideoMark` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `VideoMark` table. All the data in the column will be lost.
  - You are about to drop the column `thumbTime` on the `Audio` table. All the data in the column will be lost.
  - Made the column `videoId` on table `VideoMark` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "_TagToVideoMark" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TagToVideoMark_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToVideoMark_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoMark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoMark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mark" REAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "VideoMark_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_VideoMark" ("id", "mark", "note", "videoId") SELECT "id", "mark", "note", "videoId" FROM "VideoMark";
DROP TABLE "VideoMark";
ALTER TABLE "new_VideoMark" RENAME TO "VideoMark";
CREATE TABLE "new_Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" REAL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Audio_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Audio" ("duration", "id", "itemId") SELECT "duration", "id", "itemId" FROM "Audio";
DROP TABLE "Audio";
ALTER TABLE "new_Audio" RENAME TO "Audio";
CREATE UNIQUE INDEX "Audio_itemId_key" ON "Audio"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVideoMark_AB_unique" ON "_TagToVideoMark"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVideoMark_B_index" ON "_TagToVideoMark"("B");
