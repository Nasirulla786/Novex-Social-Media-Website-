import mongoose from "mongoose";

export const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connect SuccessFully");
  } catch (error) {
    console.log(`Db Error ${error}`);
  }
};
