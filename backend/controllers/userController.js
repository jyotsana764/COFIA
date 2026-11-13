
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: email?.trim()
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = createToken(user._id);

    // Return user details along with the authentication token.
    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again."
    });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) {
      return res.json({
        success: false,
        message: "Please enter your name"
      });
    }

    if (!validator.isEmail(email || "")) {
      return res.json({
        success: false,
        message: "Please enter a valid email"
      });
    }

    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const normalizedEmail = email.trim();

    const exists = await userModel.findOne({
      email: normalizedEmail
    });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // Return the new user's details as well.
    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account. Please try again."
    });
  }
};

// Route for Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        email + password,
        process.env.JWT_SECRET
      );

      return res.json({
        success: true,
        token
      });
    }

    return res.json({
      success: false,
      message: "Invalid credentials"
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again."
    });
  }
};

export { loginUser, registerUser, adminLogin };
