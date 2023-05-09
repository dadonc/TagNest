// Based on:
// https://dev.to/awohletz/running-prisma-migrate-in-an-electron-app-1ehm
// https://github.com/awohletz/electron-prisma-trpc-example/blob/main/src/server/prisma.ts
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { getSavePathJson, updateSavePathJson } from "./utils";
import { app } from "electron";
import { Migration, runPrismaCommand } from "./prismaHelper";

let prisma: PrismaClient;
export async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  const savePathJson = await getSavePathJson();
  console.log("SavePathJson:", savePathJson);
  const dbPath = path.join(savePathJson.savePath, "database.db");
  const dbUrl = "file:" + dbPath + "?connection_limit=1";

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  let latestMigration = "";
  let needsMigration: boolean;
  const dbExists = fs.existsSync(dbPath);
  if (!dbExists) {
    needsMigration = true;
    // prisma for whatever reason has trouble if the database file does not exist yet.
    // So just touch it here
    fs.closeSync(fs.openSync(dbPath, "w"));
  } else {
    try {
      const latest: Migration[] =
        await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`;
      latestMigration = latest[latest.length - 1]?.migration_name;
      needsMigration = latestMigration !== savePathJson.latestMigration;
    } catch (e) {
      console.error(e);
      needsMigration = true;
    }
  }

  if (needsMigration) {
    try {
      const schemaPath = path.join(
        app.getAppPath().replace("app.asar", "app.asar.unpacked"),
        "prisma",
        "schema.prisma"
      );
      console.info(
        `Needs a migration. Running prisma migrate with schema path ${schemaPath}`
      );

      // first create or migrate the database! If you were deploying prisma to a cloud service, this migrate deploy
      // command you would run as part of your CI/CD deployment. Since this is an electron app, it just needs
      // to run when the production app is started. That way if the user updates AriNote and the schema has
      // changed, it will transparently migrate their DB.
      await runPrismaCommand({
        command: ["migrate", "deploy", "--schema", schemaPath],
        dbUrl,
      });

      updateSavePathJson({
        ...savePathJson,
        latestMigration,
      });
      // seed
      // log.info("Seeding...");
      // await seed(prisma);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  } else {
    console.info("Does not need migration");
  }

  return prisma;
}
