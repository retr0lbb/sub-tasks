-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" TEXT,
    "projectIdId" TEXT,
    CONSTRAINT "task_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "task" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "task_projectIdId_fkey" FOREIGN KEY ("projectIdId") REFERENCES "projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_task" ("created_at", "description", "id", "is_complete", "parent_id", "title", "updated_at") SELECT "created_at", "description", "id", "is_complete", "parent_id", "title", "updated_at" FROM "task";
DROP TABLE "task";
ALTER TABLE "new_task" RENAME TO "task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
