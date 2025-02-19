import mongoose from "mongoose";

export default async function connectDB() {
  const DB_URL = process.env.DB_URL ?? ""

  try {
    mongoose.connect(DB_URL)
  } catch (error) {
    console.error("Error connecting to the database")
    process.exit(1)
  }

  const dbConnect = mongoose.connection

  dbConnect.once("open", () => {
    console.log(`Connected to the database: ${DB_URL}`)
  })

  dbConnect.on("error", (err) => {
    console.error(`Error connecting to the database: ${err}`)
  })
}