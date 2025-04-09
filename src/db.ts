import { Db, MongoClient } from "mongodb";
import { config } from "dotenv";

config();

// connect to MongoDB
const DB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.2olkaqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const DB_NAME = process.env.MONGODB_DBNAME || "devDatabase";

const mongoDBClient: MongoClient = new MongoClient(DB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 45000,
    connectTimeoutMS: 10000,
})

let db: Db | null = null;

export async function connectToMongoDB() {
    try {
        if (!db) {
            await mongoDBClient.connect();
            db = mongoDBClient.db(DB_NAME);
            console.log("Connected to db:", DB_NAME);
        }
        return db;
    } catch (error) {
        console.error("error connecting mongoDB: ", error);
        throw error;
    }
}