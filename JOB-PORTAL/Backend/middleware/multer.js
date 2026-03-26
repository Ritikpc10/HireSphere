import multer from "multer";

const storage = multer.memoryStorage();

const isAllowedProfilePhoto = (file) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
  return allowedMimes.includes(file.mimetype);
};

export const singleUpload = multer({ storage }).single("file");

/**
 * Upload both:
 * - `file` (resume/pdf) optional
 * - `profilePhoto` (jpg/png/jpeg) optional
 */
export const profileAndResumeUpload = multer({
  storage,
  limits: {
    // keep this relatively high; we validate photo size separately in controller
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profilePhoto") {
      if (!isAllowedProfilePhoto(file)) {
        return cb(
          new Error("profilePhoto must be a JPG/PNG/JPEG image"),
          false
        );
      }
    }
    cb(null, true);
  },
}).fields([
  { name: "file", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]);
