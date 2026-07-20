import { setServers } from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    console.warn("[DB] MONGODB_URI is not set. Database operations will fail until it is provided.");
}

/**
 * Dev-only DNS override.
 *
 * In some local/sandbox environments Node's default resolver (127.0.0.1) refuses
 * SRV queries, so `mongodb+srv://` Atlas URIs fail with `querySrv ECONNREFUSED`.
 * Point Node at a public resolver so the SRV lookup succeeds. Never runs in
 * production, where the platform's resolver works. Override the servers with
 * `DNS_SERVERS` (comma-separated) or disable with `DISABLE_DNS_OVERRIDE=1`.
 *
 * Applied both at module load and again right before connecting, so it is
 * guaranteed to take effect ahead of the SRV lookup regardless of import order.
 */
function applyDevDnsOverride(): void {
    if (
        process.env.NODE_ENV === "production" ||
        process.env.DISABLE_DNS_OVERRIDE === "1" ||
        !MONGODB_URI.startsWith("mongodb+srv://")
    ) {
        return;
    }
    try {
        const servers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        setServers(servers);
    } catch (err) {
        console.warn("[DB] Could not apply dev DNS override:", err);
    }
}

applyDevDnsOverride();

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Use global to preserve the connection across hot-reloads in development
const globalAny = global as unknown as { _mongooseCache?: MongooseCache };
const cached: MongooseCache = globalAny._mongooseCache || {conn: null, promise: null};
if (!globalAny._mongooseCache) globalAny._mongooseCache = cached;

export async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        applyDevDnsOverride();
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                // bufferCommands is true by default; we keep defaults
                // You may add connection options here if needed
            })
            .then((m) => {
                console.log("[DB] Connected to MongoDB");

                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        // Don't cache a rejected promise — otherwise every later call keeps
        // returning the same failure until a full restart (the cache lives on a
        // hot-reload-persistent global). Clearing it lets the next call retry.
        cached.promise = null;
        throw err;
    }
    return cached.conn;
}
