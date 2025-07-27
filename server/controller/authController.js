import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import transporter from "../config/nodeMailer.js";

// Register Controller
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, msg: "Please fill in all required fields: name, email, and password." });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, msg: "An account with this email already exists. Please login or use another email." });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashPass });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "🎉 Welcome to Our Website!",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>You can now explore all the features and start your journey with us.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 14px; color: #555;">If you have any questions, feel free to reply to this email.</p>
      <p style="font-size: 14px; color: #555;">Cheers,<br>The Team</p>
    </div>
  `,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, msg: "Please fill in all required fields: email and password." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, msg: "Invalid Username or Password" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.json({ success: false, msg: "Invalid Username or Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// send otp
export const sendOtp = async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await userModel.findById(user_id);

    if (user.isAccountVerified) {
      return res.json({ success: false, msg: "Your account is already verified." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">🔐 Account Verification</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Thank you for registering. Please use the OTP below to verify your account:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #007bff; padding: 10px 20px; display: inline-block; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 24 hours.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Mern Auth System</p>
      </div>
    </div>
  `,
    });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// verify account
export const verifyEmail = async (req, res) => {
  const { user_id, otp } = req.body;
  if (!user_id || !otp) {
    return res.json({ success: false, msg: "User ID and OTP are required." });
  }
  try {
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.json({ success: false, msg: "No user found" });
    }

    if (user.verifyOtp == "" || user.verifyOtp !== otp) {
      return res.json({ success: false, msg: "The OTP entered is incorrect. Please try again." });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, msg: "The OTP has expired. Please request a new one." });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, msg: "Your account is already verified." });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// checking if authenticated (using middleware to check)
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: true, msg: "Not Authenticated" });
  }
};

// send reset password otp
export const resetPassOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, msg: "Please enter your email address." });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: "No account found with this email." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #333;">🔒 Reset Your Password</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We received a request to reset your password. Use the OTP below to complete the process:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #e74c3c; padding: 10px 20px; display: inline-block; border-radius: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for only 15 minutes. Please do not share it with anyone.</p>
        <p>If you didn’t request a password reset, you can safely ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Mern Auth System. All rights reserved.</p>
      </div>
    </div>
  `,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

// reset password
export const resetPass = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, msg: "Please provide all required details (email, OTP, and new password)." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: "No account found with the provided email." });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, msg: "The OTP you entered is incorrect." });
    }
    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, msg: "The OTP has expired. Please request a new one." });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;
    user.save();

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};
