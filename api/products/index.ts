import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, COLLECTIONS } from '../lib/mongodb.js';
import { Product } from '../lib/types.js';
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
    const collection = db.collection<Product>(COLLECTIONS.PRODUCTS);

    // GET - Fetch all products
    if (req.method === 'GET') {
      const products = await collection.find({}).toArray();
      // Convert MongoDB _id to id for frontend compatibility
      const formattedProducts = products.map(p => ({
        ...p,
        id: p._id?.toString() || p.id,
        _id: undefined
      }));
      return res.status(200).json(formattedProducts);
    }

    // POST - Create new product (requires auth)
    if (req.method === 'POST') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const productData = req.body as Product;
      // Remove id if present, MongoDB will generate _id
      const { id, ...dataWithoutId } = productData;
      
      const result = await collection.insertOne({
        ...dataWithoutId,
        id: id || new ObjectId().toString()
      } as any);
      
      const newProduct = await collection.findOne({ _id: result.insertedId });
      return res.status(201).json({
        ...newProduct,
        id: newProduct?._id?.toString() || newProduct?.id,
        _id: undefined
      });
    }

    // PUT - Update product (requires auth)
    if (req.method === 'PUT') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const productData = req.body as Product;
      const { id, ...updateData } = productData;

      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Try to find by id field first, then by _id
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
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({
        ...result,
        id: result._id?.toString() || result.id,
        _id: undefined
      });
    }

    // DELETE - Delete product (requires auth)
    if (req.method === 'DELETE') {
      if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      let filter: any = { id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
      }

      const result = await collection.deleteOne(filter);

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

