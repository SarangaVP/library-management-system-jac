const API_URL = "http://localhost:8000";

export async function fetchBooks() {
  const payload = { books: [] };
  const response = await fetch(`${API_URL}/walker/view_all_books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books.");
  }

  const data = await response.json();
  return data.reports?.[0] || [];
}

export async function fetchStudents() {
  const payload = { students: [] };
  const response = await fetch(`${API_URL}/walker/view_all_students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students.");
  }

  const data = await response.json();
  return data.reports?.[0] || [];
}
