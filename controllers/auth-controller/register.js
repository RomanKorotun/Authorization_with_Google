import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";

const { JWT_SECRET, JWT_TIME } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });
  const { _id } = await User.findOne({ email });
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
  await User.findByIdAndUpdate(_id, { token });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    token,
  });
};
export default register;
