const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, address, image_url, owner_id } = req.body;

      // Validation
      if (!name || name.length < 1 || name.length > 60) {
        return res.status(400).json({
          error: "Store name must be 1-60 characters",
        });
      }

      const existingStore = await prisma.store.findUnique({
        where: { email },
      });

      if (existingStore) {
        return res.status(400).json({
          error: "Store email already exists.",
        });
      }

      const newStore = await prisma.store.create({
        data: {
          name,
          email,
          address,
          image_url,
          owner_id,
        },
      });

      res.status(201).json({
        message: "Store added successfully",
        store: newStore,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all stores with search
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { search } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        ratings: true,
      },
    });

    const formattedStores = await Promise.all(
      stores.map(async (store) => {
        const avgRating =
          store.ratings.length > 0
            ? (
                store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                store.ratings.length
              ).toFixed(2)
            : null;

        const userRating = store.ratings.find((r) => r.user_id === req.user.id);

        return {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          image_url: store.image_url,
          average_rating: avgRating,
          your_rating: userRating ? userRating.rating : null,
        };
      })
    );

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Store owner dashboard route
router.get(
  "/:storeId/ratings",
  authenticateToken,
  authorizeRoles("owner"),
  async (req, res) => {
    try {
      const store_id = parseInt(req.params.storeId);

      // checking if the store belongs to the current owner
      const store = await prisma.store.findUnique({
        where: { id: store_id },
      });

      if (!store) {
        return res.status(404).json({
          error: "store not found",
        });
      }

      if (store.owner_id !== req.user.id) {
        return res.status(403).json({
          error: "Access denied to this store",
        });
      }

      // Fetching ratings with user details
      const ratings = await prisma.rating.findMany({
        where: { store_id },
        include: { user: true },
      });

      const avgRating =
        ratings.length > 0
          ? (
              ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            ).toFixed(2)
          : null;

      const response = {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          image_url: store.image_url,
          average_rating: avgRating,
        },
        ratings: ratings.map((r) => ({
          id: r.id,
          user_name: r.user.name,
          user_email: r.user.email,
          rating: r.rating,
          created_at: r.created_at,
        })),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
