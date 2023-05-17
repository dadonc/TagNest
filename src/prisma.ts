// Based on:
// https://dev.to/awohletz/running-prisma-migrate-in-an-electron-app-1ehm
// https://github.com/awohletz/electron-prisma-trpc-example/blob/main/src/server/prisma.ts
import fs from "fs";
import path from "path";
import { fork } from "child_process";
import { app } from "electron";
import { PrismaClient } from "@prisma/client";
import { getSavePathJson, updateSavePathJson } from "./utils";
import { isDev } from "./main";
import { log as electronLog } from "electron-log";

const log = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  } else {
    electronLog(...args);
  }
};

let prisma: PrismaClient;
export async function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  const savePathJson = await getSavePathJson();
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
      log("ERROR:", e);
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
      log(
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
      // log("Seeding...");
      // await seed(prisma);
    } catch (e) {
      log("ERROR:", e);
      process.exit(1);
    }
  } else {
    log("Does not need migration");
  }

  return prisma;
}

function getPlatformName(): string {
  const isDarwin = process.platform === "darwin";
  if (isDarwin && process.arch === "arm64") {
    return process.platform + "Arm64";
  }

  return process.platform;
}

const platformName = getPlatformName();

// the node_modules/@prisma/ and node_modules/prisma folders are copied into the .vite/build folder using vite-plugin-copy
export const platformToExecutables: any = {
  win32: {
    migrationEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/migration-engine-windows.exe"
    ),
    queryEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/query_engine-windows.dll.node"
    ),
  },
  linux: {
    migrationEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x"
    ),
    queryEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node"
    ),
  },
  darwin: {
    migrationEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/migration-engine-darwin"
    ),
    queryEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/libquery_engine-darwin.dylib.node"
    ),
  },
  darwinArm64: {
    migrationEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/migration-engine-darwin-arm64"
    ),
    queryEngine: path.resolve(
      __dirname,
      "node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node"
    ),
  },
};

const mePath = platformToExecutables[platformName].migrationEngine;
const qePath = platformToExecutables[platformName].queryEngine;

interface Migration {
  id: string;
  checksum: string;
  finished_at: string;
  migration_name: string;
  logs: string;
  rolled_back_at: string;
  started_at: string;
  applied_steps_count: string;
}

async function runPrismaCommand({
  command,
  dbUrl,
}: {
  command: string[];
  dbUrl: string;
}): Promise<number> {
  log("Migration engine path", mePath);
  log("Query engine path", qePath);

  // Currently we don't have any direct method to invoke prisma migration programatically.
  // As a workaround, we spawn migration script as a child process and wait for its completion.
  // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
  try {
    const exitCode = await new Promise((resolve, _) => {
      const prismaPath = path.resolve(
        __dirname,
        "node_modules/prisma/build/index.js"
      );
      log("Prisma path", prismaPath);

      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_MIGRATION_ENGINE_BINARY: mePath,
          PRISMA_QUERY_ENGINE_LIBRARY: qePath,

          // Prisma apparently needs a valid path for the format and introspection binaries, even though
          // we don't use them. So we just point them to the query engine binary. Otherwise, we get
          // prisma:  Error: ENOTDIR: not a directory, unlink '/some/path/electron-prisma-trpc-example/packed/mac-arm64/ElectronPrismaTrpcExample.app/Contents/Resources/app.asar/node_modules/@prisma/engines/prisma-fmt-darwin-arm64'
          PRISMA_FMT_BINARY: qePath,
          PRISMA_INTROSPECTION_ENGINE_BINARY: qePath,
        },
        stdio: "pipe",
      });

      child.on("message", (msg) => {
        log(msg);
      });

      child.on("error", (err) => {
        log("ERROR:", "Child process got error:", err);
      });

      child.on("close", (code, signal) => {
        resolve(code);
      });

      child.stdout?.on("data", function (data) {
        log("prisma: ", data.toString());
      });

      child.stderr?.on("data", function (data) {
        log("ERROR:", "prisma: ", data.toString());
      });
    });

    if (exitCode !== 0)
      throw Error(`command ${command} failed with exit code ${exitCode}`);

    return exitCode;
  } catch (e) {
    log("ERROR:", e);
    throw e;
  }
}
