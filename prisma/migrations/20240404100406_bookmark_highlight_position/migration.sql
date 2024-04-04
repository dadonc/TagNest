/*
  Warnings:

  - Made the column `rangeJSON` on table `BookmarkHighlight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `BookmarkHighlight` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookmarkHighlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT NOT NULL,
    "rangeJSON" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    CONSTRAINT "BookmarkHighlight_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookmarkHighlight" ("bookmarkId", "id", "rangeJSON", "text") SELECT "bookmarkId", "id", "rangeJSON", "text" FROM "BookmarkHighlight";
DROP TABLE "BookmarkHighlight";
ALTER TABLE "new_BookmarkHighlight" RENAME TO "BookmarkHighlight";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
