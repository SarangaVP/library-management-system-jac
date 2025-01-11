import React, { useState } from "react";

const API_URL = "http://localhost:8000";

function AddStudent() {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addStudent = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    if (!studentName || !studentEmail) {
      setError("Please provide both student name and email.");
      setLoading(false);
      return;
    }

    const payload = {
      user_name: "",
      email: "",
      student_name: studentName,
      student_email: studentEmail,
    };

    try {
      const response = await fetch(`${API_URL}/walker/add_student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage("Student added successfully!");
        setStudentName("");
        setStudentEmail("");
      } else {
        const data = await response.json();
        setError(`Failed to add student: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setError("An error occurred while adding the student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Student</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Student Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter student name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Student Email</label>
        <input
          type="email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter student email"
        />
      </div>
      <button
        onClick={addStudent}
        disabled={loading}
        className={`px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Student"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}

export default AddStudent;

