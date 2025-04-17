import mongoose from 'mongoose';

// Declare mongoose on global
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Cache to store the database connection
let cached = global.mongoose;

// Initialize the cached value if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to the database
export async function connectToDB() {
  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no connection promise yet, create one
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    // Set mongoose options
    const opts = {
      bufferCommands: false,
    };

    // Connect to the database
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for the connection to be established
  cached.conn = await cached.promise;
  return cached.conn;
} 