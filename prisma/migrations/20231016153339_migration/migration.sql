-- AlterTable
ALTER TABLE "Basket" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Basket_id_seq";

-- AlterTable
CREATE SEQUENCE command_id_seq;
ALTER TABLE "Command" ALTER COLUMN "id" SET DEFAULT nextval('command_id_seq');
ALTER SEQUENCE command_id_seq OWNED BY "Command"."id";
