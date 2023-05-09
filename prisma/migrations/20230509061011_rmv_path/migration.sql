/*
  Warnings:

  - You are about to drop the column `faviconPath` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `mhtmlPath` on the `Bookmark` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "faviconFilename" TEXT,
    "mhtmlFilename" TEXT,
    "text" TEXT,
    "screenshot" TEXT
);
INSERT INTO "new_Bookmark" ("id", "screenshot", "text") SELECT "id", "screenshot", "text" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
