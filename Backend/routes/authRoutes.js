const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Validation rules
    const nameValid = name.length >= 20 && name.length <= 60;
    const addressValid = !address || address.length <= 400;
    const passwordValid =
      password.length >= 8 &&
      password.length <= 16 &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const roleValid = ["admin", "user", "owner"].includes(role);

    if (!nameValid) {
      return res.status(400).json({
        error: "Name must be 20-60 characters",
      });
    }
    if (!addressValid) {
      return res.status(400).json({
        error: "Address max length is 400",
      });
    }
    if (!passwordValid) {
      return res.status(400).json({
        error:
          "Password must be 8-16 characters, include 1 uppercase and 1 special character",
      });
    }
    if (!emailValid) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (!roleValid) {
      return res.status(400).json({
        error: "Invalid role selected",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: "User registed successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate inputs
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credientials",
      });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid credientials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successfull",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
