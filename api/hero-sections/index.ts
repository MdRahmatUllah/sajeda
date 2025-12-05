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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<HeroSection>(COLLECTIONS.HERO_SECTIONS);

    // GET - Fetch all hero sections
    if (req.method === 'GET') {
      const heroSections = await collection.find({}).sort({ createdAt: 1 }).toArray();
      const formatted = heroSections.map(h => ({
        ...h,
        id: h._id?.toString() || h.id,
        _id: undefined
      }));
      return res.status(200).json(formatted);
    }

    // POST - Create new hero section (requires auth)
    if (req.method === 'POST') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const heroData = req.body as HeroSection;
      const { id, ...dataWithoutId } = heroData;
      
      const newHero = {
        ...dataWithoutId,
        id: id || new ObjectId().toString(),
        createdAt: heroData.createdAt || Date.now(),
        isActive: heroData.isActive || false
      };

      const result = await collection.insertOne(newHero as any);
      const inserted = await collection.findOne({ _id: result.insertedId });
      
      return res.status(201).json({
        ...inserted,
        id: inserted?._id?.toString() || inserted?.id,
        _id: undefined
      });
    }

    // PUT - Update hero section (requires auth)
    if (req.method === 'PUT') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const heroData = req.body as HeroSection;
      const { id, ...updateData } = heroData;

      if (!id) {
        return res.status(400).json({ error: 'Hero section ID is required' });
      }

      let filter: any = { id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
      }

      const result = await collection.findOneAndUpdate(
        filter,
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Hero section not found' });
      }

      return res.status(200).json({
        ...result,
        id: result._id?.toString() || result.id,
        _id: undefined
      });
    }

    // DELETE - Delete hero section (requires auth)
    if (req.method === 'DELETE') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Hero section ID is required' });
      }

      // Check if trying to delete active hero
      let filter: any = { id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
      }

      const hero = await collection.findOne(filter);
      if (hero?.isActive) {
        return res.status(400).json({ error: 'Cannot delete the active hero section' });
      }

      const result = await collection.deleteOne(filter);

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Hero section not found' });
      }

      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero Sections API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

