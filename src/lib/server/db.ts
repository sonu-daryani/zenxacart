import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Lightweight JSON-file store used as a stand-in for a real database.
 * Suitable for local development; production would swap in Postgres/Prisma etc.
 */

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type StoredOrder = {
  id: string;
  userId: string;
  orderNumber: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  total: number;
  items: number;
  cjOrderId?: string;
};

export type WishlistEntry = {
  productId: string;
  addedAt: string;
};

export type StoredAddress = {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

export type UserStats = {
  totalOrders: number;
  wishlistCount: number;
  rewardPoints: number;
};

export type DbShape = {
  users: StoredUser[];
  orders: StoredOrder[];
  wishlists: Record<string, WishlistEntry[]>;
  addresses: StoredAddress[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "db.json");

/** Cache reads for the lifetime of the server process. */
let cache: DbShape | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function emptyDb(): DbShape {
  return { users: [], orders: [], wishlists: {}, addresses: [] };
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(emptyDb(), null, 2), "utf8");
  }
}

export async function readDb(): Promise<DbShape> {
  if (cache) return cache;
  await ensureFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    cache = {
      users: parsed.users ?? [],
      orders: parsed.orders ?? [],
      wishlists: parsed.wishlists ?? {},
      addresses: parsed.addresses ?? [],
    };
  } catch {
    cache = emptyDb();
  }
  return cache;
}

/** Seed sample orders/wishlist for a brand-new user so the UI isn't empty. */
export async function seedUserDemoData(userId: string): Promise<void> {
  const db = await readDb();
  if (db.orders.some((o) => o.userId === userId)) return;

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const demo: StoredOrder[] = [
    {
      id: generateId(),
      userId,
      orderNumber: `ZC-${10000 + Math.floor(Math.random() * 9000)}`,
      date: new Date(now - 7 * day).toISOString(),
      status: "Delivered",
      total: 189.98,
      items: 2,
    },
    {
      id: generateId(),
      userId,
      orderNumber: `ZC-${10000 + Math.floor(Math.random() * 9000)}`,
      date: new Date(now - 23 * day).toISOString(),
      status: "Shipped",
      total: 49.99,
      items: 1,
    },
    {
      id: generateId(),
      userId,
      orderNumber: `ZC-${10000 + Math.floor(Math.random() * 9000)}`,
      date: new Date(now - 35 * day).toISOString(),
      status: "Delivered",
      total: 259.97,
      items: 3,
    },
  ];

  await writeDb((d) => {
    d.orders.push(...demo);
    d.wishlists[userId] = [
      { productId: "1", addedAt: new Date().toISOString() },
      { productId: "4", addedAt: new Date().toISOString() },
      { productId: "8", addedAt: new Date().toISOString() },
    ];
  });
}

export async function writeDb(
  mutator: (db: DbShape) => void | Promise<void>
): Promise<DbShape> {
  // Serialize writes so concurrent requests don't trample each other.
  const next = writeQueue.then(async () => {
    const db = await readDb();
    await mutator(db);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    return db;
  });
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

/** SHA-256 password hashing (mock; replace with bcrypt/argon2 in real apps). */
export function hashPassword(plain: string): string {
  return crypto
    .createHash("sha256")
    .update(`${plain}::zencarta-salt`)
    .digest("hex");
}

export function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

export function generateId(): string {
  return crypto.randomUUID();
}
