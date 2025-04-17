import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// Variables to cache connections
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;
let isConnected = false;

// Get connection URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

// Function to connect to MongoDB
export async function connectToDatabase() {
  // If we already have a connection, return it
  if (cachedClient && cachedDb && mongoose.connection.readyState === 1) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to MongoDB using mongoose
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(uri!);
      isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  // Also connect with native MongoDB driver
  try {
    const client = new MongoClient(uri!);
    await client.connect();
    
    // Extract database name from URI
    const dbName = new URL(uri!).pathname.substring(1);
    const db = client.db(dbName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Native MongoDB client connection error:', error);
    throw error;
  }
}

// Types for collections
export interface ProjectDocument {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  tasks: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDocument {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  assignee?: string;
  projectIds: string[];
  userId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
} 