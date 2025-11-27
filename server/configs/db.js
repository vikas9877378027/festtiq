import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected data base");
    });
    await mongoose.connect(`${process.env.MONGODB_URL}/greencart`);
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDB;
