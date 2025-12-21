import { MongoClient, Db } from "mongodb"

const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// Initialize connection lazily
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MongoDB URI not configured. Please set MONGODB_URI in .env.local")
  }

  if (clientPromise) {
    return clientPromise
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

// Export a function that returns the client promise (lazy initialization)
export default function getMongoClient(): Promise<MongoClient> {
  return getClientPromise()
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  const dbName = process.env.MONGODB_DB_NAME || "ZippyCart"
  return client.db(dbName)
}

export function isMongoDBConfigured(): boolean {
  return !!process.env.MONGODB_URI
}

