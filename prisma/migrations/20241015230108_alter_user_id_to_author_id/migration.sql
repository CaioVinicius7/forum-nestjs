/*
  Warnings:

  - You are about to drop the column `user_id` on the `questions` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_user_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "user_id",
ADD COLUMN     "author_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
