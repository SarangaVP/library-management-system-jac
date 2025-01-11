import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function HandleBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(null); 

  const fetchBorrowings = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { borrowings: [] }; 

      const response = await fetch(`${API_URL}/walker/view_all_borrowings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const fetchedBorrowings = data.reports?.[0] || [];
        setBorrowings(fetchedBorrowings); 
      } else {
        setError("Failed to fetch borrowings. Please try again.");
      }
    } catch {
      setError("An error occurred while fetching borrowings.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    setReturning(borrowingId); 
    setError("");

    const payload = {
      user_name: "",
      email: "",
      borrowing_id: borrowingId,
    };

    try {
      const response = await fetch(`${API_URL}/walker/return_book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.reports?.[0] === true) {
        setBorrowings((prevBorrowings) =>
          prevBorrowings.map((borrowing) =>
            borrowing.id === borrowingId
              ? { ...borrowing, context: { ...borrowing.context, is_returned: true } }
              : borrowing
          )
        );
      } else {
        setError("Failed to return book. Please try again.");
      }
    } catch {
      setError("An error occurred while returning the book.");
    } finally {
      setReturning(null); 
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">View All Borrowings</h2>
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={fetchBorrowings}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Borrowings"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {borrowings.length > 0 && (
        <ul className="mt-6 space-y-4">
          {borrowings.map((borrowing) => (
            <li
              key={borrowing.id}
              className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="font-bold text-gray-700">Student ID:</span>{" "}
                  {borrowing.context?.student_id || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Book ID:</span>{" "}
                  {borrowing.context?.book_id || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Borrow Date:</span>{" "}
                  {borrowing.context?.borrow_date || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Returned:</span>{" "}
                  {borrowing.context?.is_returned ? "Yes" : "No"}
                </p>
              </div>
              {!borrowing.context?.is_returned && (
                <button
                  onClick={() => handleReturnBook(borrowing.id)}
                  disabled={returning === borrowing.id}
                  className={`px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ${
                    returning === borrowing.id ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {returning === borrowing.id ? "Returning..." : "Return"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HandleBorrowings;


