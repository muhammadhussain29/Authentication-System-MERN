import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPass,
  resetPassOtp,
  sendOtp,
  verifyEmail,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/send-verify-otp", userAuth, sendOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/is-authenticated", userAuth, isAuthenticated);

authRouter.post("/send-reset-otp", resetPassOtp);
authRouter.post("/reset-password", resetPass);

export default authRouter;
