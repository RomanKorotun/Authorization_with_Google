import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL,
  JWT_SECRET,
  JWT_TIME,
} = process.env;
const REDIRECT_URL = `${BASE_URL}/api/auth/google-redirect`;

const googleRedirect = async (req, res) => {
  const { code } = req.query;
  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URL,
    grant_type: "authorization_code",
  });

  const { access_token } = data;
  const { data: profile } = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );
  const user = await User.findOne({ email: profile.email });
  if (!user) {
    const user = await User.create({
      email: profile.email,
      name: profile.name,
      password: " ",
    });
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
    const updateUser = await User.findByIdAndUpdate(user._id, { token });
    return;
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
  const updateUser = await User.findByIdAndUpdate(user._id, { token });
};

export default googleRedirect;
