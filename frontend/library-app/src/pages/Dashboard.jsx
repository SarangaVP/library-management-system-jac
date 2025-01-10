import React, { useState } from "react";
import ViewBooks from "../components/ViewBooks.jsx";
import ViewStudents from "../components/ViewStudents.jsx";

function Dashboard({ onLogout }) {
  const [menu, setMenu] = useState("View Students");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-500 text-white flex flex-col space-y-4 py-6 px-4">
        {["View Books", "View Students", "Add Student", "Add Book", "Logout"].map((item) => (
          <button
            key={item}
            onClick={() => (item === "Logout" ? onLogout() : setMenu(item))}
            className={`py-2 px-4 rounded-md ${
              menu === item
                ? "bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600 transition duration-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-4/5 p-6">
        {menu === "View Students" && <ViewStudents />}
        {menu === "View Books" && <ViewBooks />}
        {menu === "Add Student" && <AddStudent />}
        {menu === "Add Book" && <AddBook />}
      </div>
    </div>
  );
}

export default Dashboard;
