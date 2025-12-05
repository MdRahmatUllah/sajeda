import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, COLLECTIONS } from '../lib/mongodb.js';
import { HeroSection } from '../../types.js';
import { ObjectId } from 'mongodb';

// Simple auth check for write operations
function isAuthenticated(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  
  return (
    username === process.env.VITE_ADMIN_USERNAME &&
    password === process.env.VITE_ADMIN_PASSWORD
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Hero section ID is required' });
    }

    const db = await getDatabase();
    const collection = db.collection<HeroSection>(COLLECTIONS.HERO_SECTIONS);

    // Deactivate all hero sections
    await collection.updateMany({}, { $set: { isActive: false } });

    // Activate the specified hero section
    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await collection.findOneAndUpdate(
      filter,
      { $set: { isActive: true } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Hero section not found' });
    }

    // Return all hero sections with updated state
    const allSections = await collection.find({}).sort({ createdAt: 1 }).toArray();
    const formatted = allSections.map(h => ({
      ...h,
      id: h._id?.toString() || h.id,
      _id: undefined
    }));

    return res.status(200).json({
      success: true,
      activatedId: id,
      heroSections: formatted
    });
  } catch (error) {
    console.error('Activate Hero Section API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

