const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    about: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    watchlist: {
      type: [String],
      default: [],
    },

    alertedAsteroids: {
      type: [String],
      default: [],
    },

    alertPreferences: {
      daysBeforeApproach: {
        type: Number,
        default: 7,
      },
      maxMissDistanceAU: {
        type: Number,
        default: 0.2,
      },
      minDiameterKM: {
        type: Number,
        default: 0.3,
      },
      notifyRiskLevels: {
        type: [String],
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: ["HIGH"],
      },
      emailNotifications: {
        type: Boolean,
        default: true,
        index: true,
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
    },

    verificationCodeExpire: {
      type: Date,

    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = mongoose.model("User", userSchema);
