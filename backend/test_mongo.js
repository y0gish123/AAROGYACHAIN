const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const test = async () => {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("✅ Success!");
    } catch (err) {
        console.error("❌ Failed!");
        console.error(err.message);
    } finally {
        await client.close();
    }
};

test();
