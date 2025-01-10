import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { books: [] };
      const response = await fetch(`${API_URL}/walker/view_all_books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const fetchedBooks = data.reports?.[0] || [];
        if (fetchedBooks.length > 0) {
          setBooks(fetchedBooks);
        } else {
          setBooks([]);
          setError("No books available.");
        }
      } else {
        setError(
          `Failed to fetch books. Error ${response.status}: ${data.message || "Unknown error."}`
        );
      }
    } catch (e) {
      setError("An error occurred while fetching books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">View All Books</h2>
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={fetchBooks}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Books"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {books.length > 0 && (
        <ul className="mt-6 space-y-4">
          {books.map((book, index) => (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-200"
            >
              <p>
                <span className="font-bold text-gray-700">Title:</span>{" "}
                {book.context?.title || "N/A"}
              </p>
              <p>
                <span className="font-bold text-gray-700">Author:</span>{" "}
                {book.context?.author || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewBooks;

