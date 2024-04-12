import User from "../../models/User.js";
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "logOut success" });
};
export default logout;
