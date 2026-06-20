// ecommerce/backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "Admin", "customer", "guest"],
      default: "user",
      lowercase: true,
    },

    phone: { type: String, trim: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    address: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

/* ✅ FIXED: Modern pre-save hook (no "next" needed) */
userSchema.pre("save", async function () {
  // Only hash if password is modified (new user or password change)
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* Compare password */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
