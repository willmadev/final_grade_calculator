/*
  Warnings:

  - Added the required column `grade` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worth` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "grade" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "worth" DOUBLE PRECISION NOT NULL;
