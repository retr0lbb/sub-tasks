-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "parent_id" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "is_complete" BOOLEAN NOT NULL DEFAULT false
);
