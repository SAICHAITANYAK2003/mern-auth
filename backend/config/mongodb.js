import mongoose from "mongoose";

const connectDb = async () => {
  mongoose.connection.on("connected", () => console.log("✅ DB is connected"));
  await mongoose.connect(`${process.env.MONGO_URL}/practicedb2`);
};

export default connectDb;
