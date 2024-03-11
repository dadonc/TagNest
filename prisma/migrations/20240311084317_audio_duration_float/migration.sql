/*
  Warnings:

  - You are about to alter the column `duration` on the `Audio` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" REAL,
    "itemId" TEXT NOT NULL,
    "thumbTime" REAL,
    CONSTRAINT "Audio_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Audio" ("duration", "id", "itemId", "thumbTime") SELECT "duration", "id", "itemId", "thumbTime" FROM "Audio";
DROP TABLE "Audio";
ALTER TABLE "new_Audio" RENAME TO "Audio";
CREATE UNIQUE INDEX "Audio_itemId_key" ON "Audio"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
