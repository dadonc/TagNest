-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preview" TEXT NOT NULL,
    "words" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "text_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_text" ("id", "itemId", "preview", "words") SELECT "id", "itemId", "preview", "words" FROM "text";
DROP TABLE "text";
ALTER TABLE "new_text" RENAME TO "text";
CREATE UNIQUE INDEX "text_itemId_key" ON "text"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
