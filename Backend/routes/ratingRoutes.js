const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    if (!store_id || !rating) {
      return res.status(400).json({
        error: "Store ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const store = await prisma.store.findUnique({
      where: { id: store_id },
    });

    if (!store) {
      return res.status(404).json({
        error: "Store not found",
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        user_id_store_id: {
          user_id: req.user.id,
          store_id: store_id,
        },
      },
    });

    if (existingRating) {
      return res.status(400).json({
        error: "You alread rated this store.",
      });
    }

    await prisma.rating.create({
      data: {
        user_id: req.user.id,
        store_id,
        rating,
      },
    });

    res.status(201).json({
      message: "Rating submitted succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// Update existing rating
router.put("/:storeId", authenticateToken, async (req, res) => {
  try {
    const store_id = parseInt(req.params.storeId);
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        user_id_store_id: {
          user_id: req.user.id,
          store_id: store_id,
        },
      },
    });

    if (!existingRating) {
      return res.status(404).json({
        error: "You haven't rated this store yet.",
      });
    }

    await prisma.rating.update({
      where: {
        user_id_store_id: {
          user_id: req.user.id,
          store_id: store_id,
        },
      },
      data: { rating },
    });

    res.status(200).json({
      message: "Rating updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
