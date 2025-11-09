import { FileAdapter } from "../db/fileAdapter";
import { RedisAdapter } from "../db/redisAdapter";
import { DBAdapter } from "../db/types";

export async function makeAdapter(): Promise<DBAdapter> {
  const dbType = (process.env.DB_TYPE ?? "file").toLowerCase(); // file is default
  const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
  const snapshotPath = process.env.SNAPSHOT_PATH ?? "./pokodex-snapshot.json";

  if (dbType === "file") {
    return await setupFileAdapter(snapshotPath);
  }

  const redis = new RedisAdapter(redisUrl);
  try {
    await redis.init();
    await redis.restoreFromDisk(snapshotPath);
    console.log("Using RedisAdapter");
    setupShutdown(redis, snapshotPath);
    return redis;
  } catch (err) {
    console.warn("Redis not available, falling back to FileAdapter:", err);
    return await setupFileAdapter(snapshotPath);
  }
}

function setupShutdown(adapter: DBAdapter, snapshotPath: string) {
  const doSnapshot = async () => {
    try {
      console.log("Snapshotting DB to", snapshotPath);
      await adapter.snapshotToDisk(snapshotPath);
    } catch (err) {
      console.error("Snapshot failed", err);
    }
  };

  const graceful = async () => {
    await doSnapshot();
    try {
      await adapter.close();
    } catch (e) {}
    process.exit(0);
  };

  // do snapshot before shutting down
  process.on("SIGINT", graceful);
  process.on("SIGTERM", graceful);
  process.on("beforeExit", async () => {
    await doSnapshot();
  });
}

async function setupFileAdapter(snapshotPath: string) {
  console.log("Using FileAdapter");
  const file = new FileAdapter("./pokodex-filedb.json");
  await file.init();
  await file.restoreFromDisk(snapshotPath).catch(() => {});
  setupShutdown(file, snapshotPath);
  return file;
}
