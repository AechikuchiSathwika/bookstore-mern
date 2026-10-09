import { useEffect, useState } from "react";

const CartIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 2v2h2l3.6 7.6-1.35 2.4A2 2 0 0 0 7 17h12v-2H7.4l1.1-2h7.45a2 2 0 0 0 1.75-1.03l3.58-6.5A1 1 0 0 0 20.4 4H5.2l-.94-2H1z" />
  </svg>
);

export default function App() {
  const [books, setBooks] = useState([]);
  const [types, setTypes] = useState([]);
  const [cart, setCart] = useState({}); // { bookId: { book, quantity } }
  const [qty, setQty] = useState({}); // quantity selector per book
  const [sortDir, setSortDir] = useState(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(3000);
  const [type, setType] = useState("All");
  const [message, setMessage] = useState("");

  const loadBooks = async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`/api/books?${qs}`);
      setBooks(await res.json());
    } catch {
      setMessage("Could not load books. Is the server running?");
    }
  };

  useEffect(() => {
    loadBooks();
    fetch("/api/books/types").then((r) => r.json()).then(setTypes).catch(() => {});
  }, []);

  const handleSort = () => {
    const next = sortDir === "asc" ? "desc" : "asc";
    setSortDir(next);
    loadBooks({ sort: next, min, max, ...(type !== "All" && { type }) });
  };
  const handlePriceFilter = () =>
    loadBooks({ min, max, ...(sortDir && { sort: sortDir }), ...(type !== "All" && { type }) });
  const handleTypeFilter = handlePriceFilter;

  const addToCart = (book) => {
    const n = Number(qty[book._id] || 1);
    setCart((c) => ({
      ...c,
      [book._id]: { book, quantity: (c[book._id]?.quantity || 0) + n },
    }));
    setMessage("");
  };

  const removeFromCart = (id) =>
    setCart((c) => {
      const { [id]: _removed, ...rest } = c;
      return rest;
    });

  const items = Object.values(cart);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.book.price * i.quantity, 0);

  const buyNow = async () => {
    if (!items.length) return setMessage("Your cart is empty.");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ bookId: i.book._id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCart({});
      setMessage(`Order placed! Total: ${data.total} Rs`);
    } catch (err) {
      setMessage(err.message || "Order failed");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="brand">GFG Book Store</h1>
        <span className="total">Total Price: {total}</span>
        <div className="cart" title="Cart">
          <CartIcon />
          <span className="badge">{count}</span>
        </div>
      </header>

      <button className="buy-now" onClick={buyNow}>Buy Now</button>

      <h2 className="list-title">Book List</h2>
      {message && <p className="message">{message}</p>}

      <div className="controls">
        <button onClick={handleSort}>Sort by Price{sortDir === "asc" ? " ↑" : sortDir === "desc" ? " ↓" : ""}</button>
        <label>
          Min Price:
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        </label>
        <label>
          Max Price:
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        </label>
        <button onClick={handlePriceFilter}>Filter by Price Range</button>
        <label>
          Filter by Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button onClick={handleTypeFilter}>Filter by Type</button>
      </div>

      <div className="grid">
        {books.map((b) => (
          <div className="card" key={b._id}>
            <img src={b.image} alt={b.title} />
            <p className="desc">{b.description}</p>
            <p className="price">Price: {b.price} Rs</p>
            <p>{b.type}</p>
            <p className="author">{b.author}</p>
            <div className="actions">
              <button onClick={() => addToCart(b)}>Add to Cart</button>
              <select
                value={qty[b._id] || 1}
                onChange={(e) => setQty({ ...qty, [b._id]: e.target.value })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              {cart[b._id] && (
                <button onClick={() => removeFromCart(b._id)}>Remove ({cart[b._id].quantity})</button>
              )}
            </div>
          </div>
        ))}
        {!books.length && <p>No books match your filters.</p>}
      </div>
    </div>
  );
}
