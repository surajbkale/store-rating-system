const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const bcrypt = require("bcrypt");

const router = express.Router();
const prisma = new PrismaClient();

// Admin dashboard stats
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const totalUsers = await prisma.user.count();
      const totalStores = await prisma.store.count();
      const totalRatings = await prisma.rating.count();

      res.status(200).json({
        total_users: totalUsers,
        total_stores: totalStores,
        total_ratings: totalRatings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Listing all the users with fileters: name, email, role
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        address,
        role,
        sortBy = "id",
        order = "asc",
      } = req.query;

      const users = await prisma.user.findMany({
        where: {
          AND: [
            name ? { name: { contains: name, mode: "insensitive" } } : {},
            email ? { email: { contains: email, mode: "insensitive" } } : {},
            address
              ? { address: { contains: address, mode: "insensitive" } }
              : {},
            role ? { role } : {},
          ],
        },
        orderBy: {
          [sortBy]: order,
        },
        include: {
          stores: {
            include: {
              ratings: true,
            },
          },
        },
      });

      const usersWithRatings = users.map((user) => {
        if (user.role === "owner" && user.stores.length > 0) {
          const storeRatings = user.stores[0].ratings;
          const avgRating =
            storeRatings.length > 0
              ? (
                  storeRatings.reduce((sum, r) => sum + r.rating, 0) /
                  storeRatings.length
                ).toFixed(2)
              : null;

          return {
            ...user,
            store_average_rating: avgRating,
          };
        }
        return user;
      });

      res.status(200).json(usersWithRatings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Listing all the stores with filters name, email, address
router.get(
  "/stores",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, address, sortBy = "id", order = "asc" } = req.query;

      const stores = await prisma.store.findMany({
        where: {
          AND: [
            name ? { name: { contains: name, mode: "insensitive" } } : {},
            email ? { email: { contains: email, mode: "insensitive" } } : {},
            address
              ? { address: { contains: address, mode: "insensitive" } }
              : {},
          ],
        },
        include: {
          ratings: true,
        },
        orderBy: {
          [sortBy]: order,
        },
      });

      const formattedStores = stores.map((store) => {
        const avgRating =
          store.ratings.length > 0
            ? (
                store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                store.ratings.length
              ).toFixed(2)
            : null;

        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          image_url: store.image_url,
          average_rating: avgRating,
        };
      });

      res.status(200).json(formattedStores);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Create new user (admin only)
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password, address, role } = req.body;

      // Validate inputs (optional but good)
      if (!name || !email || !password || !role)
        return res.status(400).json({ error: "All fields required." });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, address, role },
      });

      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create user." });
    }
  }
);

// Create new store (admin only)
router.post(
  "/stores",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, address, owner_id } = req.body;

      if (!name || !email)
        return res.status(400).json({ error: "Name and email required." });

      if (owner_id && isNaN(parseInt(owner_id))) {
        return res.status(400).json({ error: "Invalid owner ID." });
      }

      const store = await prisma.store.create({
        data: {
          name,
          email,
          address,
          owner_id: owner_id ? parseInt(owner_id) : null,
        },
      });

      res.status(201).json(store);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create store." });
    }
  }
);

module.exports = router;
