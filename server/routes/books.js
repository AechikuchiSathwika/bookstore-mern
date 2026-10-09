const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// GET /api/books?sort=asc|desc&min=0&max=3000&type=Fiction
router.get("/", async (req, res) => {
  try {
    const { sort, min, max, type } = req.query;
    const filter = {};

    if (min !== undefined || max !== undefined) {
      filter.price = {};
      if (min !== undefined && min !== "") filter.price.$gte = Number(min);
      if (max !== undefined && max !== "") filter.price.$lte = Number(max);
    }
    if (type && type !== "All") filter.type = type;

    let query = Book.find(filter);
    if (sort === "asc") query = query.sort({ price: 1 });
    if (sort === "desc") query = query.sort({ price: -1 });

    res.json(await query);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/types", async (_req, res) => {
  try {
    res.json(await Book.distinct("type"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
