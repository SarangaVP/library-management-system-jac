import React, { useState } from "react";
import { fetchStudents } from "../utils/fetchUtils";

const API_URL = "http://localhost:8000";

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleFetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedStudents = await fetchStudents();
      setStudents(fetchedStudents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    setRemoving(true);
    setError("");

    const payload = {
      user_name: "",
      email: "",
      student_id: studentId,
    };

    try {
      const response = await fetch(`${API_URL}/walker/remove_student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== studentId)
        );
      } else {
        setError("Failed to remove the student. Please try again.");
      }
    } catch {
      setError("An error occurred while removing the student.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">View All Students</h2>
      <button
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleFetchStudents}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Students"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {students.length > 0 && (
        <ul className="mt-6 space-y-4">
          {students.map((student) => (
            <li
              key={student.id}
              className="p-4 bg-gray-100 rounded-md shadow-md border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="font-bold text-gray-700">ID:</span>{" "}
                  {student.id || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Name:</span>{" "}
                  {student.context?.name || "N/A"}
                </p>
                <p>
                  <span className="font-bold text-gray-700">Email:</span>{" "}
                  {student.context?.email || "N/A"}
                </p>
              </div>
              <button
                onClick={() => handleRemoveStudent(student.id)}
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

export default ViewStudents;

