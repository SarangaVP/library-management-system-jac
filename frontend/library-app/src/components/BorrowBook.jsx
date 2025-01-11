import React, { useState, useEffect } from "react";
import { fetchBooks, fetchStudents } from "../utils/fetchUtils";

const API_URL = "http://localhost:8000";

function BorrowBook() {
  const [bookRefId, setBookRefId] = useState(""); 
  const [studentRefId, setStudentRefId] = useState(""); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await fetchBooks();
        const studentsData = await fetchStudents();
        setBooks(booksData);
        setStudents(studentsData);
      } catch (err) {
        setError("");
      }
    };

    fetchData();
  }, []);

  const handleBorrowBook = async () => {
    setMessage("");
    setError("");

    if (!bookRefId || !studentRefId) {
      setError("Please select both Book and Student.");
      return;
    }

    setLoading(true);

    const payload = {
      user_name: "",
      email: "",
      student_ref_id: studentRefId, 
      book_ref_id: bookRefId, 
    };

    try {
      const response = await fetch(`${API_URL}/walker/borrow_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.reports?.[0] === true) {
        setMessage("Book borrowed successfully!");
        setBookRefId("");
        setStudentRefId("");
      } else {
        setError("Failed to borrow book. Please check the input or try again.");
      }
    } catch (err) {
      setError("An error occurred while borrowing the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Borrow a Book</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Book</label>
        <select
          value={bookRefId}
          onChange={(e) => setBookRefId(e.target.value)} 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.context?.title || "N/A"} (ID: {book.id})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Student</label>
        <select
          value={studentRefId}
          onChange={(e) => setStudentRefId(e.target.value)} 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.context?.name || "N/A"} (ID: {student.id})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleBorrowBook}
        disabled={loading}
        className={`px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Borrowing..." : "Borrow Book"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}

export default BorrowBook;

