-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "url" TEXT,
    "note" TEXT,
    "getsCurrentlyImported" BOOLEAN NOT NULL DEFAULT false,
    "importStep" INTEGER NOT NULL DEFAULT -1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fileId" TEXT,
    "type" TEXT NOT NULL,
    "bookmarkId" TEXT,
    "videoId" TEXT,
    CONSTRAINT "Item_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Item_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("bookmarkId", "createdAt", "fileId", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url", "videoId") SELECT "bookmarkId", "createdAt", "fileId", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url", "videoId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
