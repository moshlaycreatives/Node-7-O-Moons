import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const first_name = process.env.ADMIN_FIRST_NAME;
const last_name = process.env.ADMIN_LAST_NAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

export const createAdmin = async () => {
  const isAdminExist = await User.findOne({ role: "admin" });

  if (!isAdminExist) {
    try {
      await User.create({
        first_name,
        last_name,
        email,
        password,
        role: "admin",
      });
    } catch (error) {
      console.error("An error occurred while creating admin.\n", error);
    }
  }
};
