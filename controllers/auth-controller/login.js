import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import "dotenv/config";
import { HttpError } from "../../helpers/index.js";

const { JWT_SECRET, JWT_TIME } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Your Email or password is wrong");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Your Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    name: user.name,
    email: user.email,
    token,
  });
};
export default login;
