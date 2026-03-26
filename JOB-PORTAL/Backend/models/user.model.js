import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    // Top-level alias for profile photo.
    // Frontend currently reads `user.profile.profilePhoto`, but we keep this field
    // to satisfy API requirements and future compatibility.
    profilePhoto: {
      type: String,
      default: "",
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pancard: {
      type: String,
      required: true,
      unique: true,
    },
    adharcard: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      default: "Student",
      required: true,
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    profile: {
      bio: {
        type: String,
      },
      skills: [{ type: String }],
      resume: {
        type: String, // URL to resume file
      },
      resumeOriginalname: {
        type: String, // Original name of resume file
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      profilePhoto: {
        type: String, // URL to profile photo file
        default: "",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
