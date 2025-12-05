import { MongoClient, MongoClientOptions, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
};

const client = new MongoClient(process.env.MONGODB_URI, options);

// Try to attach to Vercel's database pool if available
async function initDatabasePool() {
  try {
    // Dynamic import for Vercel functions (only works in Vercel runtime)
    const vercelFunctions = await import('@vercel/functions');
    if (vercelFunctions.attachDatabasePool) {
      vercelFunctions.attachDatabasePool(client);
    }
  } catch {
    // Not running in Vercel environment, client will be used directly
    console.log('Running outside Vercel - using direct MongoDB connection');
  }
}

// Initialize on module load
initDatabasePool();

// Database name
const DB_NAME = 'shazeda_candles';

// Collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  HERO_SECTIONS: 'heroSections'
} as const;

// Get the database instance
export async function getDatabase(): Promise<Db> {
  await client.connect();
  return client.db(DB_NAME);
}

// Get a specific collection
export async function getCollection<T extends Document>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Export the client for direct usage if needed
export default client;

