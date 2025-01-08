import streamlit as st
import requests

API_URL = "http://localhost:8000"


if "authToken" not in st.session_state:
    st.session_state["authToken"] = None
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False
if "username" not in st.session_state:
    st.session_state["username"] = "User"


if not st.session_state.get("logged_in"):
    tabs = st.tabs(["Login", "Register"])

    with tabs[0]:  
        st.subheader("Login")
        login_email = st.text_input("Email", key="login_email")
        login_password = st.text_input("Password", type="password", key="login_password")
        if st.button("Login", key="login_button"):
            if not login_email or not login_password:
                st.error("Please provide both email and password.")
            else:
                response = requests.post(
                    f"{API_URL}/user/login", json={"email": login_email, "password": login_password}
                )
                if response.status_code == 200:
                    token = response.json().get("token")
                    profile = response.json().get("user")
                    st.session_state["authToken"] = token
                    st.session_state["username"] = profile.get("email", "User")
                    st.session_state["logged_in"] = True
                    st.success("Login successful!")
                else:
                    st.error(f"Login failed. {response.json().get('detail', 'Please check your credentials.')}")

    with tabs[1]:  
        st.subheader("Register")
        register_email = st.text_input("Email (Register)", key="register_email")
        register_password = st.text_input("Password (Register)", type="password", key="register_password")
        if st.button("Register", key="register_button"):
            if not register_email or not register_password:
                st.error("Please provide both email and password.")
            else:
                response = requests.post(
                    f"{API_URL}/user/register", json={"email": register_email, "password": register_password}
                )
                if response.status_code == 201:
                    st.success("Registration successful! Please login.")
                else:
                    st.error(f"Registration failed. {response.json().get('detail', 'Try again.')}")

if st.session_state.get("logged_in"):
    st.sidebar.title("Navigation")
    menu = st.sidebar.radio("Menu", ["View Books", "View Students", "Add Student", "Add Book", "Logout"])

    if menu == "View Books":
        st.header("View All Books")
        headers = {"Authorization": f"Bearer {st.session_state['authToken']}"}
        try:
            payload = {"books": []} 
            response = requests.post(f"{API_URL}/walker/view_all_books", headers=headers, json=payload)
            if response.status_code == 200:
                books = response.json().get("reports", [])
                if books:
                    st.write(books)
                    # for book in books:
                    #     st.write(f"**Title**: {book.get('title', 'N/A')}, **Author**: {book.get('author', 'N/A')}")
                else:
                    st.write("No books available.")
            else:
                st.error(f"Failed to fetch books. Error {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            st.error(f"An error occurred: {e}")

    elif menu == "View Students":
        st.header("View All Students")
        headers = {"Authorization": f"Bearer {st.session_state['authToken']}"}
        try:
            payload = {"students": []}  
            response = requests.post(f"{API_URL}/walker/view_all_students", headers=headers, json=payload)
            if response.status_code == 200:
                students = response.json().get("reports", [])
                if students:
                    st.write(students)
                else:
                    st.write("No students available.")
            else:
                st.error(f"Failed to fetch students. Error {response.status_code}: {response.text}")
        except requests.exceptions.RequestException as e:
            st.error(f"An error occurred: {e}")

    elif menu == "Add Student":
        st.header("Add a New Student")
        student_name = st.text_input("Student Name", key="add_student_name")  # Add the 'student_name' field
        student_email = st.text_input("Student Email", key="add_student_email")  # Add the 'student_email' field
        if st.button("Add Student", key="add_student_button"):
            headers = {"Authorization": f"Bearer {st.session_state['authToken']}"}
            payload = {
                "user_name": "",
                "email": "",
                "student_name": student_name,
                "student_email": student_email
            }
            try:
                response = requests.post(f"{API_URL}/walker/add_student", headers=headers, json=payload)
                if response.status_code == 200:
                    st.success("Student added successfully!")
                else:
                    st.error(f"Failed to add student. Error {response.status_code}: {response.text}")
            except requests.exceptions.RequestException as e:
                st.error(f"An error occurred: {e}")

    elif menu == "Add Book":
        st.header("Add a New Book")
        title = st.text_input("Book Title", key="add_book_title")  # Add the 'title' field
        author = st.text_input("Author", key="add_book_author")  # Add the 'author' field
        if st.button("Add Book", key="add_book_button"):
            headers = {"Authorization": f"Bearer {st.session_state['authToken']}"}
            payload = {
                "user_name": "",
                "email": "",
                "title": title,
                "author": author
            }
            try:
                response = requests.post(f"{API_URL}/walker/add_book", headers=headers, json=payload)
                if response.status_code == 200:
                    st.success("Book added successfully!")
                else:
                    st.error(f"Failed to add book. Error {response.status_code}: {response.text}")
            except requests.exceptions.RequestException as e:
                st.error(f"An error occurred: {e}")

    

    elif menu == "Logout":
        st.session_state["authToken"] = None
        st.session_state["logged_in"] = False
        st.session_state["username"] = "User"
        st.success("You have been logged out!")