/*
  Warnings:

  - Added the required column `genre` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "genre" TEXT NOT NULL;
