const mongoose = require('mongoose');

const DATA_KEYS = ['users', 'cars', 'drivers', 'carEntries', 'driverSalaries', 'personalFinance'];
const collectionName = process.env.MONGODB_COLLECTION || 'barot_mobility_data';

const dataSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: [mongoose.Schema.Types.Mixed], required: true }
}, { collection: collectionName, versionKey: false });

const DataDocument = mongoose.model('BarotMobilityData', dataSchema);
let connectionPromise;

function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI must be configured; the application no longer uses local JSON persistence');
  }
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://; copy the full connection string from MongoDB Atlas');
  }
  if (/%(?![0-9A-Fa-f]{2})/.test(uri)) {
    throw new Error('MONGODB_URI contains an invalid percent escape. Encode a literal % as %25 and other password symbols such as @ as %40');
  }
  try {
    new URL(uri);
  } catch {
    throw new Error('MONGODB_URI is not valid. URL-encode special characters in the database username/password (for example @ becomes %40) and copy the full Atlas URI');
  }
  return uri;
}

async function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(getMongoUri(), {
      // This is a traditional, low-concurrency Render web service; keep one
      // reusable client with a conservative pool and bounded network waits.
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 300000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000
    }).catch(error => {
      connectionPromise = undefined;
      throw new Error(`Unable to connect to MongoDB: ${error.message}`);
    });
  }
  await connectionPromise;
}

async function readData(key) {
  if (!DATA_KEYS.includes(key)) {
    throw new Error(`Unsupported data key: ${key}`);
  }
  await connectDatabase();
  const document = await DataDocument.findOne({ key }).lean();
  return document ? document.data : [];
}

async function writeData(key, data) {
  if (!DATA_KEYS.includes(key)) {
    throw new Error(`Unsupported data key: ${key}`);
  }
  if (!Array.isArray(data)) {
    throw new TypeError(`Persisted ${key} data must be an array`);
  }
  await connectDatabase();
  await DataDocument.findOneAndUpdate(
    { key },
    { $set: { data } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
}

async function initializeDatabase() {
  await connectDatabase();
  await DataDocument.bulkWrite(
    DATA_KEYS.map(key => ({
      updateOne: {
        filter: { key },
        update: { $setOnInsert: { key, data: [] } },
        upsert: true
      }
    }))
  );
}

async function closeDatabase() {
  if (connectionPromise) {
    await mongoose.disconnect();
    connectionPromise = undefined;
  }
}

module.exports = { readData, writeData, initializeDatabase, closeDatabase };
