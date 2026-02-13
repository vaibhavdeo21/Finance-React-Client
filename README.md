This documentation explains the React architecture, specifically focusing on how Redux manages the "Global Brain" and how the `Can` component handles permissions visually.

# 💻 MergeMoney Client (finance-react-client)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)


This is the responsive User Interface for **MergeMoney**. It is a **Single Page Application (SPA)** that uses Redux for global state management and a custom RBAC component system to dynamically show/hide features based on user permissions.

---

## 📚 Table of Contents
- [Project Overview](#-project-overview)
- [Folder Structure (The Blueprint)](#-folder-structure-the-blueprint)
- [Key Features & Components](#-key-features--components)
- [How to Run](#-how-to-run)

---

## 🌟 Project Overview
The frontend isn't just a pretty face; it's a smart application that handles:
1.  **State Management**: Remembers who you are across every page using **Redux**.
2.  **Dynamic UI**: Hides "Delete" buttons if you don't have permission (using the `Can` component).
3.  **Secure Payments**: Loads the Razorpay checkout system directly into the browser.

---

## 📂 Folder Structure (The Blueprint)

We organized the React app to separate "Pages" (Views) from "Components".

```text
finance-react-client/
├── src/
│   ├── components/         # The Building Blocks
│   │   ├── errors/
│   │   │   └── UnauthorizedAccess.jsx # The "Access Denied" screen
│   │   ├── AddExpenseModal.jsx
│   │   ├── AppLayout.jsx         # Layout for Visitors (No Login)
│   │   ├── Can.jsx               # The "Permission Guard" Component
│   │   ├── CreateGroupModal.jsx
│   │   ├── Footer.jsx
│   │   ├── GroupCard.jsx
│   │   ├── Header.jsx
│   │   ├── UserFooter.jsx
│   │   ├── UserHeader.jsx
│   │   └── UserLayout.jsx        # Layout for Logged-in Users
│   │
│   ├── config/
│   │   └── appConfig.js          # Backend URL settings
│   │
│   ├── pages/              # The Main Views
│   │   ├── Dashboard.jsx         # The User Hub
│   │   ├── GroupExpenses.jsx     # Expense Feed & Settlements
│   │   ├── Groups.jsx
│   │   ├── Home.jsx              # Landing Page
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   ├── ManagePayments.jsx    # Razorpay Payment Page
│   │   ├── ManageUsers.jsx       # Admin Panel
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   │
│   ├── rbac/               # The Rules Engine
│   │   ├── ProtectedRoute.jsx    # Router Guard
│   │   └── userPermissions.js    # Permission List
│   │
│   ├── redux/              # The Global Brain
│   │   └── user/
│   │       ├── action.js         # "Do this!" (e.g., Login)
│   │       └── reducers.js       # "Update State!" (e.g., Save User)
│   │
│   ├── App.jsx             # The Router Config
│   ├── main.jsx            # The Entry Point
│   └── store.js            # The Redux Store Setup
│
├── .env.development        # Frontend Secrets
├── index.html              # HTML Root (Razorpay script lives here)
└── vite.config.js          # Build Tool Config
```

## 💡 Key Features & Components

### 🌐 1. The Global Brain (Redux)

**📁 Folder:** `src/redux/user`

**Concept:**  
Instead of passing user data (props) through multiple layers of components, we store it in a **Global Store** using Redux. This allows every component to access user data efficiently.

**How it works:**

- **Action:**  
  _"Hey Store, the user just logged in!"_

- **Reducer:**  
  _"Okay, I will save their Name, Email, and Role so every component can use it."_

✅ Result: Cleaner code, fewer props, and centralized state management.

---

### 🛡️ 2. The Permission Guard (`Can.jsx`)

**Purpose:**  
Acts like an invisible security layer for UI elements.

**Usage Example:**
```jsx
<Can permission="DELETE_GROUP">
  <DeleteBtn />
</Can>
```

**How it works:**

- The component checks the **Redux store** for user permissions.
- If the user lacks the required permission (`DELETE_GROUP`), the button **does not render at all**.

✅ Not hidden — it simply doesn't exist in the DOM, improving security and UI control.

---

### 🧩 3. Layout System

#### **AppLayout**
- Minimal layout with header and footer.
- Used for **Home** and **Login** pages.

#### **UserLayout**
- Includes **Sidebar**, **Profile Dropdown**, and dashboard navigation.
- Designed specifically for authenticated user areas.

✅ Keeps the codebase modular and organized based on application context.

---

### 💳 4. Payment Page (`ManagePayments.jsx`)

**Workflow:**

1. User clicks **"Buy 10 Credits"**.
2. The frontend calls the backend to generate an **Order ID**.
3. `window.Razorpay` (injected via `index.html`) opens the payment gateway.
4. Upon successful payment:
   - The Redux store updates automatically.
   - The user sees their new credits **instantly**, without needing a refresh.

✅ Provides a smooth and real-time payment experience.

## 🏃 How to Run

Follow the steps below to set up and run the client locally.

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Setup Environment

Create a `.env.development` file in the root directory and add:

```env
VITE_SERVER_ENDPOINT=http://localhost:5001
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
```

⚠️ **Important:** Environment variables **must start with `VITE_`** or the frontend will ignore them.

---

### 3️⃣ Start Client

```bash
npm run dev
```

✅ The client should now be running on your local development server.
