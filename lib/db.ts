import clientPromise from "./mongodb";

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db("careconnect");
    console.log("Successfully connected to database");
    return { client, db };
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}
