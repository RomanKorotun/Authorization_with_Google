import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, updateOptions } from "./hooks.js";

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", updateOptions);

export const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

const User = model("user", userSchema);

export default User;
