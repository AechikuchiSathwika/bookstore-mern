require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

const img = (seed) => `https://picsum.photos/seed/${seed}/300/300`;

const books = [
  { title: "The Great Gatsby", description: "A classic novel about the American Dream", price: 20, type: "Fiction", author: "F. Scott Fitzgerald", image: img("gatsby") },
  { title: "To Kill a Mockingbird", description: "A powerful story of racial injustice and moral growth", price: 15, type: "Fiction", author: "Harper Lee", image: img("mockingbird") },
  { title: "1984", description: "A dystopian vision of a totalitarian future society", price: 255, type: "Dystopian", author: "George Orwell", image: img("nineteen84") },
  { title: "Pride and Prejudice", description: "A witty romance of manners and misjudgment", price: 120, type: "Romance", author: "Jane Austen", image: img("pride") },
  { title: "The Hobbit", description: "A reluctant hero's journey to the Lonely Mountain", price: 350, type: "Fantasy", author: "J.R.R. Tolkien", image: img("hobbit") },
  { title: "Brave New World", description: "A engineered society trading freedom for comfort", price: 180, type: "Dystopian", author: "Aldous Huxley", image: img("bravenew") },
  { title: "Sapiens", description: "A brief history of humankind", price: 499, type: "Non-Fiction", author: "Yuval Noah Harari", image: img("sapiens") },
  { title: "Atomic Habits", description: "Small changes that compound into remarkable results", price: 399, type: "Self-Help", author: "James Clear", image: img("habits") },
  { title: "Dune", description: "Politics, prophecy and spice on a desert planet", price: 650, type: "Science Fiction", author: "Frank Herbert", image: img("dune") },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore");
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log(`Seeded ${books.length} books`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
