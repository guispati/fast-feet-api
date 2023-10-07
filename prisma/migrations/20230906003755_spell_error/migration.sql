/*
  Warnings:

  - You are about to drop the column `slugg` on the `questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "questions_slugg_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "slugg",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");
