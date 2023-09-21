/*
  Warnings:

  - You are about to drop the column `faviconFilename` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `mhtmlFilename` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `screenshot` on the `Bookmark` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT,
    "faviconPath" TEXT,
    "previewImagePath" TEXT,
    "screenshotPath" TEXT,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("id", "itemId", "text") SELECT "id", "itemId", "text" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_itemId_key" ON "Bookmark"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
