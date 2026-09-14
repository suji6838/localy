import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";

export type Collection = "experts" | "bookings";

const LOCAL_DIR = path.join(process.cwd(), ".data");

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocal<T>(collection: Collection): Promise<T[]> {
  try {
    const raw = await readFile(path.join(LOCAL_DIR, `${collection}.json`), "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeLocal<T>(collection: Collection, records: T[]) {
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(
    path.join(LOCAL_DIR, `${collection}.json`),
    JSON.stringify(records, null, 2),
    "utf-8",
  );
}

async function readBlob<T>(collection: Collection): Promise<T[]> {
  const { blobs } = await list({ prefix: `store/${collection}.json` });
  const match = blobs.find((blob) => blob.pathname === `store/${collection}.json`);
  if (!match) return [];
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

async function writeBlob<T>(collection: Collection, records: T[]) {
  await put(`store/${collection}.json`, JSON.stringify(records, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function listRecords<T>(collection: Collection): Promise<T[]> {
  return hasBlobToken() ? readBlob<T>(collection) : readLocal<T>(collection);
}

export async function appendRecord<T>(collection: Collection, record: T): Promise<void> {
  const records = await listRecords<T>(collection);
  records.push(record);
  if (hasBlobToken()) {
    await writeBlob(collection, records);
  } else {
    await writeLocal(collection, records);
  }
}

export async function replaceRecords<T>(collection: Collection, records: T[]): Promise<void> {
  if (hasBlobToken()) {
    await writeBlob(collection, records);
  } else {
    await writeLocal(collection, records);
  }
}
