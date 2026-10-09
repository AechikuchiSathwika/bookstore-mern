const express = require("express");
const Book = require("../models/Book");
const Order = require("../models/Order");

const router = express.Router();

// POST /api/orders  { items: [{ bookId, quantity }] }
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    let total = 0;
    for (const { bookId, quantity } of items) {
      const book = await Book.findById(bookId);
      const qty = Number(quantity);
      if (!book || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: "Invalid item in cart" });
      }
      orderItems.push({ book: book._id, quantity: qty, price: book.price });
      total += book.price * qty;
    }

    const order = await Order.create({ items: orderItems, total });
    res.status(201).json({ orderId: order._id, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
