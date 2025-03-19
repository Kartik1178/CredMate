import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, unique: true },
  address: String,
  dateOfBirth: { type: Date, required: true },
  governmentID: { type: String, unique: true, required: true },
  accountType: { type: String, enum: ["savings", "current"], required: true },
  balance: { type: Number, default: 0 },
  password: { type: String, required: true },
  securityQuestions: [{ question: String, answer: String }],
  tokens: [{ token: String }],
  otp: { type: String }, // Store hashed OTP
  otpExpiresAt: { type: Date },
}, { timestamps: true });

// **Pre-save Hook to Hash Password Before Saving**
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    next(error);
  }
});

// **Method to Generate JWT Token**
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// **Method to Verify Password**
UserSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
