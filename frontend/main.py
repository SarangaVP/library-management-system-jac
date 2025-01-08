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

