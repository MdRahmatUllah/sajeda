import { MongoClient, MongoClientOptions, Db } from 'mongodb';

// Database name
const DB_NAME = 'shazeda_candles';

// Collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  HERO_SECTIONS: 'heroSections'
} as const;

// Lazy client initialization
let client: MongoClient | null = null;

function getClient(): MongoClient {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!client) {
    const options: MongoClientOptions = {
      appName: "devrel.vercel.integration",
      maxIdleTimeMS: 5000
    };
    client = new MongoClient(process.env.MONGODB_URI, options);
  }

  return client;
}

// Get the database instance
export async function getDatabase(): Promise<Db> {
  const mongoClient = getClient();
  await mongoClient.connect();
  return mongoClient.db(DB_NAME);
}

// Get a specific collection
export async function getCollection<T extends Document>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Export the getClient function for direct usage if needed
export { getClient };

