/*
  Warnings:

  - The values [COMPLETED] on the enum `DisbursementStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DisbursementStatus_new" AS ENUM ('PENDING', 'CLAIMED', 'EXPIRED', 'CLAWED_BACK');
ALTER TABLE "public"."Disbursement" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Disbursement" ALTER COLUMN "status" TYPE "DisbursementStatus_new" USING ("status"::text::"DisbursementStatus_new");
ALTER TYPE "DisbursementStatus" RENAME TO "DisbursementStatus_old";
ALTER TYPE "DisbursementStatus_new" RENAME TO "DisbursementStatus";
DROP TYPE "public"."DisbursementStatus_old";
ALTER TABLE "Disbursement" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
