import queryString from "query-string";
const { GOOGLE_CLIENT_ID, BASE_URL } = process.env;
const REDIRECT_URL = `${BASE_URL}/api/auth/google-redirect`;

const googleAuth = (req, res) => {
  const queryParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    prompt: "consent",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`);
};
export default googleAuth;
