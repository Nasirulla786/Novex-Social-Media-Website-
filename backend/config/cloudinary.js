import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadCloudinary = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_APISECRET,
    });

    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    fs.unlinkSync(file);
    return res.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export default uploadCloudinary;
