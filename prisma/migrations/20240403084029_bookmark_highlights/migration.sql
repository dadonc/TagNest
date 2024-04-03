-- CreateTable
CREATE TABLE "BookmarkHighlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT,
    "rangeJSON" TEXT,
    "bookmarkId" TEXT NOT NULL,
    CONSTRAINT "BookmarkHighlight_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
