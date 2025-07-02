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

module.exports = router;
