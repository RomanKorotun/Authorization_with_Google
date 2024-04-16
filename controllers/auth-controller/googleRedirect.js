import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL,
  JWT_SECRET,
  JWT_TIME,
  FRONTEND_URL,
} = process.env;

const googleRedirect = async (req, res) => {
  console.log("redirect");
  const { code } = req.query;
  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
    grant_type: "authorization_code",
  });
  console.log(data);

  const { access_token } = data;
  const { data: profile } = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  const user = await User.findOne({ email: profile.email });

  if (!user) {
    console.log("hello");
    const newUser = await User.create({
      email: profile.email,
      name: profile.name,
      password: " ",
    });
    console.log(newUser);
    const payload = {
      id: newUser._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
    await User.findByIdAndUpdate(newUser._id, { token });
    res.redirect(`${FRONTEND_URL}/register?token=${token}`);
    return;
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TIME });
  await User.findByIdAndUpdate(user._id, { token });
  return res.redirect(`${FRONTEND_URL}/register?token=${token}`);
};

export default googleRedirect;
