/*
  Warnings:

  - You are about to drop the column `projectIdId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_projectIdId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_userId_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "projectIdId",
DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
