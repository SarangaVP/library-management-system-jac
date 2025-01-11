import React, { useState } from "react";
import { fetchBooks } from "../utils/fetchUtils";

const API_URL = "http://localhost:8000";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleFetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedBooks = await fetchBooks();
      setBooks(fetchedBooks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (bookId) => {
    setRemoving(true);
    setError("");

    const payload = {
      user_name: "",
      email: "",
      book_id: bookId,
    };

    try {
      const response = await fetch(`${API_URL}/walker/remove_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      } else {
        setError("Failed to remove the book. Please try again.");
      }
    } catch {
      setError("An error occurred while removing the book.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">View All Books</h2>
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleFetchBooks}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Books"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {books.length > 0 && (
        <ul className="mt-6 space-y-4">
          {books.map((book) => (
            <li
              key={book.id}
              className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="font-bold text-gray-700">ID:</span>{" "}
                  {book.id || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Title:</span>{" "}
                  {book.context?.title || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Author:</span>{" "}
                  {book.context?.author || "N/A"}
                </p>
              </div>
              <button
                onClick={() => handleRemoveBook(book.id)}
                disabled={removing}
                className={`px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ${
                  removing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewBooks;
