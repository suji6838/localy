import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";

export type Collection = "experts" | "bookings";

const LOCAL_DIR = path.join(process.cwd(), ".data");

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Each record gets its own immutable blob file (collection/{id}.json) instead of all
// records sharing one repeatedly-overwritten JSON file. A single shared file that gets
// overwritten on every write hits Vercel Blob's CDN/eventual-consistency edge cases
// under frequent writes (a read right after a write can miss it); a freshly-created,
// never-overwritten path does not have that problem, and per-record files also remove
// the read-modify-write race that a shared array would have under concurrent writes.
type WithId = { id: string };

async function listLocal<T extends WithId>(collection: Collection): Promise<T[]> {
  const dir = path.join(LOCAL_DIR, collection);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const records = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => JSON.parse(await readFile(path.join(dir, f), "utf-8")) as T),
  );
  return records;
}

async function writeLocal<T extends WithId>(collection: Collection, record: T) {
  const dir = path.join(LOCAL_DIR, collection);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${record.id}.json`), JSON.stringify(record, null, 2), "utf-8");
}

async function listBlob<T extends WithId>(collection: Collection): Promise<T[]> {
  const { blobs } = await list({ prefix: `${collection}/` });
  const records: (T | null)[] = await Promise.all(
    blobs.map(async (blob): Promise<T | null> => {
      const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as T;
    }),
  );
  return records.filter((r): r is T => r !== null);
}

async function writeBlob<T extends WithId>(collection: Collection, record: T) {
  await put(`${collection}/${record.id}.json`, JSON.stringify(record, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export async function listRecords<T extends WithId>(collection: Collection): Promise<T[]> {
  return hasBlobToken() ? listBlob<T>(collection) : listLocal<T>(collection);
}

export async function appendRecord<T extends WithId>(collection: Collection, record: T): Promise<void> {
  if (hasBlobToken()) {
    await writeBlob(collection, record);
  } else {
    await writeLocal(collection, record);
  }
}

export async function updateRecord<T extends WithId>(
  collection: Collection,
  id: string,
  updater: (record: T) => T,
): Promise<T | null> {
  const records = await listRecords<T>(collection);
  const record = records.find((r) => r.id === id);
  if (!record) return null;
  const updated = updater(record);
  if (hasBlobToken()) {
    await writeBlob(collection, updated);
  } else {
    await writeLocal(collection, updated);
  }
  return updated;
}
