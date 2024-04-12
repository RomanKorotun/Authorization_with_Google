import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";
import { HttpError } from "../helpers/index.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization not define!"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Authorization row not valid"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || token !== user.token) {
      return next(HttpError(401, " User not define"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
};

export default authenticate;
