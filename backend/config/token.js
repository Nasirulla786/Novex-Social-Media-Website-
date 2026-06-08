
import jwt from "jsonwebtoken";

export const generateToken = async (id, res) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "10y",
    });

    if(!token) res.json({message:"token noot found"})


    return token;
  } catch (error) {
    console.log(error);
  }
};
