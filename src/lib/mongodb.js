import mongoose from 'mongoose';

let isConnected = false;
let connectionTimer = null;

const TIMEOUT_DURATION = 300000;

const connectMongoDB = async () => {
  try {
    if (connectionTimer) {
      clearTimeout(connectionTimer);
    }

    if (isConnected && mongoose.connection.readyState === 1) {
      setConnectionTimeout();
      return;
    }

    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      setConnectionTimeout();
      return;
    }

    if (mongoose.connection.readyState === 2) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
      isConnected = true;
      setConnectionTimeout();
      return;
    }

    await mongoose.connect(process.env.MONGODB_DEPLOYMENT_STRING, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    isConnected = true;
    console.log("Connected to MongoDB");
    setConnectionTimeout();

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnectFailed', () => {
      console.error('MongoDB reconnection failed');
      isConnected = false;
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    isConnected = false;
    throw error;
  }
};

const setConnectionTimeout = () => {
  if (connectionTimer) {
    clearTimeout(connectionTimer);
  }

  connectionTimer = setTimeout(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        isConnected = false;
        console.log("Closed MongoDB connection due to inactivity");
      }
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
    }
  }, TIMEOUT_DURATION);
};

const cleanupHandler = async (signal) => {
  try {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    if (connectionTimer) {
      clearTimeout(connectionTimer);
    }
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
};

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
  process.on(signal, () => cleanupHandler(signal));
});

export default connectMongoDB;

export const getModel = (modelName, schema) => {
  if (!modelName || !schema) {
    throw new Error('Model name and schema are required');
  }
  return mongoose.models?.[modelName] || mongoose.model(modelName, schema);
};