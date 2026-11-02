const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { readData, writeData, initializeDatabase, closeDatabase } = require('./db');

const DATA_KEYS = ['users', 'cars', 'drivers', 'carEntries', 'driverSalaries', 'personalFinance'];
const sourceDirectory = path.join(__dirname, 'data');

function readJsonFile(key) {
  const filePath = path.join(sourceDirectory, `${key}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(parsed)) {
    throw new Error(`${filePath} must contain a JSON array`);
  }
  return parsed;
}

async function migrate() {
  await initializeDatabase();
  for (const key of DATA_KEYS) {
    const sourceData = readJsonFile(key);
    const existingData = await readData(key);
    if (existingData.length > 0) {
      throw new Error(`MongoDB collection already contains ${key}; migration stopped without overwriting data`);
    }
    await writeData(key, sourceData);
    console.log(`Migrated ${sourceData.length} ${key} record(s)`);
  }
}

migrate()
  .then(() => closeDatabase())
  .catch(async error => {
    console.error(error.message);
    await closeDatabase();
    process.exitCode = 1;
  });
