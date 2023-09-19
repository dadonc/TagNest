/*
  Warnings:

  - You are about to drop the column `bookmarkId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `isGroup` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

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
    "fps" REAL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Video_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("aspectRatio", "bitrate", "duration", "fps", "height", "id", "metaBitrate", "width") SELECT "aspectRatio", "bitrate", "duration", "fps", "height", "id", "metaBitrate", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_itemId_key" ON "Video"("itemId");
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "url" TEXT,
    "note" TEXT,
    "getsCurrentlyImported" BOOLEAN NOT NULL DEFAULT false,
    "importStep" INTEGER NOT NULL DEFAULT -1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Item" ("createdAt", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url") SELECT "createdAt", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("createdAt", "id", "path") SELECT "createdAt", "id", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "faviconFilename" TEXT,
    "mhtmlFilename" TEXT,
    "text" TEXT,
    "screenshot" TEXT,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("faviconFilename", "id", "mhtmlFilename", "screenshot", "text") SELECT "faviconFilename", "id", "mhtmlFilename", "screenshot", "text" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_itemId_key" ON "Bookmark"("itemId");
CREATE TABLE "new_Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tag" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
