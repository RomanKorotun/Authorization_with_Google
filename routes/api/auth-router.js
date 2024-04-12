import express from "express";
import {
  googleAuth,
  googleRedirect,
  login,
  logout,
  register,
} from "../../controllers/auth-controller/index.js";
import { authenticate, isEmptyBody } from "../../middleware/index.js";
import { userLoginSchema, userRegisterSchema } from "../../models/User.js";
import { validateBody, ctrlWrapper } from "../../decorators/index.js";

const authRouter = express.Router();

authRouter.get("/google", ctrlWrapper(googleAuth));

authRouter.get("/google-redirect", ctrlWrapper(googleRedirect));

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userRegisterSchema),
  ctrlWrapper(register)
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userLoginSchema),
  ctrlWrapper(login)
);

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

export default authRouter;
