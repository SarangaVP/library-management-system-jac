import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBook = async () => {
    setMessage("");
    setError("");

    if (!title || !author) {
      setError("Please provide both book title and author.");
      return;
    }

    setLoading(true);

    const payload = {
      user_name: "",
      email: "",
      title,
      author,
    };

    try {
      const response = await fetch(`${API_URL}/walker/add_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Book added successfully!");
        setTitle("");
        setAuthor("");
      } else {
        const data = await response.json();
        setError(`Failed to add book: ${data.detail || "Unknown error"}`);
      }
    } catch (e) {
      setError("An error occurred while adding the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Book</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Book Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleAddBook}
        disabled={loading}
        className={`px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Book"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}

export default AddBook;

