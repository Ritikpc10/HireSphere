import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const existingAdharcard = await User.findOne({ adharcard });
    if (existingAdharcard) {
      return res.status(400).json({
        message: "Adhar number already exists",
        success: false,
      });
    }

    const existingPancard = await User.findOne({ pancard });
    if (existingPancard) {
      return res.status(400).json({
        message: "Pan number already exists",
        success: false,
      });
    }

    let profilePhotoUrl = "";
    const file = req.file;
    const hasCloudinary =
      Boolean(process.env.CLOUD_NAME) &&
      Boolean(process.env.CLOUD_API_KEY || process.env.CLOUD_API) &&
      Boolean(process.env.CLOUD_API_SECRET || process.env.API_SECRET);
    if (file && hasCloudinary) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content
        );
        profilePhotoUrl = cloudResponse.secure_url;
      } catch (err) {
        // Photo upload shouldn't block account creation
        console.error("Cloudinary upload failed (register):", err?.message || err);
        profilePhotoUrl = "";
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      profilePhoto: profilePhotoUrl,
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    await newUser.save();

    return res.status(201).json({
      message: `Account created successfully for ${fullname}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error registering user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }
    const jwtSecret = process.env.JWT_SECRET || "dev-change-me";

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: "You don't have the necessary role to access this resource",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: "1d",
    });

    const sanitizedUser = {
      _id: user._id,
      profilePhoto: user.profilePhoto,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
    };

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });

    return res.status(200).json({
      message: `Welcome back ${user.fullname}`,
      user: sanitizedUser,
      token,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error logging out",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",").map((s) => s.trim());

    const hasCloudinary =
      Boolean(process.env.CLOUD_NAME) &&
      Boolean(process.env.CLOUD_API || process.env.CLOUD_API_KEY) &&
      Boolean(process.env.API_SECRET || process.env.CLOUD_API_SECRET);

    // Handle resume upload (field: "file")
    const resumeFile = req.files?.file?.[0] || req.file;
    if (resumeFile && hasCloudinary) {
      const fileUri = getDataUri(resumeFile);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
      });
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    // Handle profile photo upload (field: "profilePhoto")
    const photoFile = req.files?.profilePhoto?.[0];
    if (photoFile && hasCloudinary) {
      const photoUri = getDataUri(photoFile);
      const cloudResponse = await cloudinary.uploader.upload(photoUri.content, {
        folder: "hiresphere/profiles",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error updating profile",
      success: false,
    });
  }
};

// POST /api/user/forgot-password — generate reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[FORGOT PASSWORD] Email NOT FOUND in Database: ${email}`);
      // Don't reveal to frontend whether email exists
      return res.status(200).json({
        message: "If an account exists, a reset code has been sent to your email",
        success: true,
      });
    }
    console.log(`[FORGOT PASSWORD] Found user ${user.fullname} for email ${email}. Attempting to send code...`);

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    // Send email with reset code
    try {
      const { sendEmail, emailTemplates } = await import("../utils/emailService.js");
      const template = emailTemplates.passwordResetEmail(user.fullname, resetCode);
      await sendEmail({ to: email, ...template });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Still log code as fallback
      console.log(`[PASSWORD RESET] Code for ${email}: ${resetCode}`);
    }

    return res.status(200).json({
      message: "If an account exists, a reset code has been sent to your email",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

// POST /api/user/reset-password — verify code & update password
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        message: "Email, reset code, and new password are required",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid or expired reset code",
        success: false,
      });
    }

    const isValid = await bcrypt.compare(resetCode, user.resetPasswordToken);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid reset code",
        success: false,
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
