const User = require("../models/userModel");
const crypto = require("crypto");
const { sendAlertEmail, sendResetPasswordEmail, sendVerificationEmail } = require("../utils/emailService");

exports.registerUser = async ({ name, email, password, about }) => {
  email = email.toLowerCase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }


  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({
    name,
    email,
    password,
    about,
    watchlist: [],
    alertedAsteroids: [],
    verificationCode,
    verificationCodeExpire,
    verificationCode,
    verificationCodeExpire,
    isVerified: true, // Auto-verified for now
  });



  const token = user.generateToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      watchlist: user.watchlist,
      alertPreferences: user.alertPreferences,
    },
  };
};

exports.verifyEmail = async (email, code) => {
  const user = await User.findOne({ 
    email: email.toLowerCase(),
    verificationCode: code,
    verificationCodeExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error("Invalid or expired verification code");
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save();

  const token = user.generateToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      watchlist: user.watchlist,
      alertPreferences: user.alertPreferences,
    },
  };
};

exports.resendVerificationCode = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("Email already verified");

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpire = verificationCodeExpire;
    await user.save();

    await sendVerificationEmail(user.email, verificationCode, user.name);

    return { message: "Verification code resent" };
};

exports.loginUser = async ({ email, password }) => {
  email = email.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }



  const token = user.generateToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      watchlist: user.watchlist,
      alertPreferences: user.alertPreferences,
    },
  };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendResetPasswordEmail(user.email, resetLink, user.name);

  return { message: "Reset email sent" };
};

exports.resetPassword = async (token, newPassword) => {
  const crypto = require("crypto");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return { message: "Password reset successful" };
};

exports.googleLogin = async (idToken) => {
  const axios = require("axios");

  try {
    // console.log(`[GoogleAuth] Verifying token of length: ${idToken ? idToken.length : 'undefined'}`);

    let response;
    try {
      response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );
    } catch (axiosError) {
      console.error("[GoogleAuth] Token verification failed:", axiosError.response?.data || axiosError.message);
      throw new Error("Invalid Google Token");
    }

    const { email, name, given_name, family_name, sub, picture } = response.data;
    // console.log(`[GoogleAuth] Token verified for email: ${email}`);

    if (!email) {
      throw new Error("Invalid Google Token: Email not found");
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      

      let displayName = name;
      if (!displayName && given_name) {
        displayName = `${given_name} ${family_name || ''}`.trim();
      }
      
      user = await User.create({
        name: displayName || "Google User",
        email: email,
        password: randomPassword,
        about: "Joined via Google",
        watchlist: [],
        alertedAsteroids: [],
        isVerified: true, // Google users are verified by default
      });
      // console.log(`[GoogleAuth] Created new user: ${email}`);
    } else {
      console.log(`[GoogleAuth] Found existing user: ${email}`);
      // If user exists but wasn't verified (e.g. registered but didn't verify), 
      // Google login should verify them.
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();
      }
    }

    const token = user.generateToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
        watchlist: user.watchlist,
        alertPreferences: user.alertPreferences,
      },
    };
  } catch (error) {
    console.error("[GoogleAuth] Service Error:", error.message);
    throw new Error("Google authentication failed: " + error.message);
  }
};
