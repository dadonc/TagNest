-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "faviconFilename" TEXT,
    "mhtmlFilename" TEXT,
    "text" TEXT,
    "screenshot" TEXT,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("faviconFilename", "id", "itemId", "mhtmlFilename", "screenshot", "text") SELECT "faviconFilename", "id", "itemId", "mhtmlFilename", "screenshot", "text" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_itemId_key" ON "Bookmark"("itemId");
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("createdAt", "id", "itemId", "path") SELECT "createdAt", "id", "itemId", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");
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
    CONSTRAINT "Video_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("aspectRatio", "bitrate", "duration", "fps", "height", "id", "itemId", "metaBitrate", "width") SELECT "aspectRatio", "bitrate", "duration", "fps", "height", "id", "itemId", "metaBitrate", "width" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_itemId_key" ON "Video"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
