import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function ReturnBook() {
  const [bookId, setBookId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReturnBook = async () => {
    setMessage("");
    setError("");

    if (!bookId || !studentId) {
      setError("Please provide both Book ID and Student ID.");
      return;
    }

    setLoading(true);

    const payload = {
      book_id: bookId,
      student_id: studentId,
    };

    try {
      const response = await fetch(`${API_URL}/walker/return_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Book returned successfully!");
        setBookId("");
        setStudentId("");
      } else {
        const data = await response.json();
        setError(`Failed to return book: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      setError("An error occurred while returning the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Return a Book</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Book ID</label>
        <input
          type="text"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          placeholder="Enter Book ID"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter Student ID"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleReturnBook}
        disabled={loading}
        className={`px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Returning..." : "Return Book"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}

export default ReturnBook;
