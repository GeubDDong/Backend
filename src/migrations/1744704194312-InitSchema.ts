import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1744704194312 implements MigrationInterface {
    name = 'InitSchema1744704194312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP CONSTRAINT "FK_84ab4695df67e98b29efbd1645d"`);
        await queryRunner.query(`ALTER TABLE "toilets" RENAME COLUMN "comment_count" TO "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "avg_rating" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_image" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "toilets" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "toilets" ADD "avg_rating" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq" OWNED BY "users"."id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('"users_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD CONSTRAINT "FK_84ab4695df67e98b29efbd1645d" FOREIGN KEY ("toilet_id") REFERENCES "toilets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP CONSTRAINT "FK_84ab4695df67e98b29efbd1645d"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toilets" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "toilets" ADD "avg_rating" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD "updated_at" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD "created_at" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_image"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "avg_rating"`);
        await queryRunner.query(`ALTER TABLE "toilets" RENAME COLUMN "avg_rating" TO "comment_count"`);
        await queryRunner.query(`ALTER TABLE "toilet_facilities" ADD CONSTRAINT "FK_84ab4695df67e98b29efbd1645d" FOREIGN KEY ("toilet_id") REFERENCES "toilets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
