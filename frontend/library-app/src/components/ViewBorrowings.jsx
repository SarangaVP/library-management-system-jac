import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function ViewBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (fetchedBorrowings.length > 0) {
          setBorrowings(fetchedBorrowings);
        } else {
          setBorrowings([]);
          setError("No borrowings available.");
        }
      } else {
        setError("Failed to fetch borrowings. Please try again.");
      }
    } catch {
      setError("An error occurred while fetching borrowings.");
    } finally {
      setLoading(false);
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
          {borrowings.map((borrowing, index) => (
            <li
              key={borrowing.id || index}
              className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-200"
            >
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewBorrowings;
