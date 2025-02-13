# DevLink - Frontend

DevLink is a social platform (linkedin clone) for developers to connect, share experiences and check the available jobs. This repository contains the frontend implementation using **React**, **Redux Toolkit** to provide a smooth and interactive user experience. Must be run with backend part which can be found here [DevLink Backend](https://github.com/pjblitz86/DevLink-backend)

## 📦 Installation

### Prerequisites

Make sure you have **Node.js** or **npm/yarn** installed.

### Clone the repository

```sh
git clone https://github.com/pjblitz86/DevLink-frontend.git
cd DevLink-frontend
```

### Install dependencies

```sh
npm install
# or
yarn install
```

## 🔥 Running the App

### Start the development server

```sh
npm run dev
```

The app will be available at **http://localhost:3000**

## 🚀 Implemented Features

- **UI/Theme**

  - CSS responsive design.
  - Additional Tailwind classes.
  - Easily change primary, dark, light, success, and danger color schemes in `App.css`.

- **Authentication**

  - Login, register, and logout functionality.
  - Navbar logic to hide private route pages.
  - Public pages: Developers and Jobs.
  - Private pages require user authentication.
  - JWT token is saved in `localStorage` and sent with each request.
  - Backend uses Spring Security and JWT for authentication and authorization.

- **Redux Toolkit State**

  - Global state management for better component access.
  - State persists after page refresh to prevent user logout.
  - `loadUser` ensures the token is valid even after closing and reopening the tab.

- **Custom Alerts**

  - Success and danger alerts.
  - Displays validation errors.
  - Alerts for post, edit, and delete operations to show success or failure.

- **User avatar picture upload**

  - Users can upload a profile picture from their dashboard.
  - The uploaded avatar updates in profiles, posts, comments, and the dashboard immediately.
  - Images are stored in the backend and accessible via /uploads/ directory.

### **GitHub Profiles Integration**

- Users can link their **GitHub profile** by adding their **GitHub username** to their profile.
- The latest **5 repositories** from their GitHub account will be displayed on their profile.

## 🛠️ Tech Stack

### **Frontend**

- **React**: Functional components and hooks-based implementation.
- **Redux Toolkit**: State management with slices.
- **React Router DOM**: Client-side routing for navigation.
- **Axios**: API requests to interact with the backend.
- **CSS & Tailwind**: Responsive and clean UI design.

### **Backend (Connected to Frontend)**

- [DevLink Backend](https://github.com/pjblitz86/DevLink-backend)
- Built with **Java Spring Boot** and **mySQL**.

## 📂 Project Structure

```
DevLink-frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Redux slices for auth, posts, and profiles
│   ├── layouts/           # Shared layout components
│   ├── pages/             # Different pages (Landing, Dashboard, etc.)
│   ├── utils/             # Utility functions and API requests
│   ├── App.jsx            # Main application component
│   ├── store.js           # Redux store configuration
│   └── index.js           # Entry point
├── .env                   # Environment variables
├── package.json           # Project dependencies and scripts
├── README.md              # Project documentation
└── .gitignore             # Ignored files
```

## 🛠️ Redux Slices Overview

- **authSlice.js** - Handles authentication, login, and registration.
- **profileSlice.js** - Manages user profiles, education, and experience.
- **postSlice.js** - Manages posts, comments, and interactions.
- **jobsSlice.js** - Jobs and interactions.

## 📄 Page Structure

- **Landing/Home Page** (Public)

  - Default route where guests land.
  - Public access to Developers, Jobs, Register, and Login pages.
  - Authenticated users are redirected to the dashboard.

- **Dashboard Page** (Protected)

  - Only accessible by authenticated users.
  - Profile creation form with required field validation.
  - Users can upload a custom profile picture.
  - If a profile exists, dashboard sections include:
    - **Profile Actions**: View, Edit Profile, Add Experience, Add Education.
    - **Experience Section**: Add and remove job experiences.
    - **Education Section**: Add and remove education records.
    - **Danger Zone**: Options to delete profile and account.
  - Edit profile reuses the same form as profile creation.

- **Developers Page (Profiles)**

  - Displays all user-created profiles from the database.
  - Users can view individual profiles via a button.
  - Authenticated users can edit only their own profiles.
  - Profile pictures appear via Gravatar or user uploaded; default placeholder for others.

- **Individual Profile (Profile page)**

  - Shows UI of all the fields entered via create profile form.
  - Social media pressable links which take to corresponding sites
  - Github Repos feature - if user entered corrected github user name in create/update profile form an api call will fetch the last 5 user github repos with clickable links.

- **Posts Page** (Protected)

  - Upper section: Form to create a post.
  - Lower section: Displays all posts sorted by newest creation date.
  - Each post displays profile picture, name, and a direct link to the user’s profile.
  - Like and unlike buttons.
  - Discussion button shows comment count and links to the comments page.
  - Delete button appears only for the post owner; deleting a post removes all associated comments.

- **Comments Page** (Protected)

  - Similar structure to posts page.
  - Displays post text at the top.
  - Comment submission form.
  - Comments appear below with user profile access via profile picture.

- **Jobs Page** (Public with Protected Features)
  - Users can add jobs; guests must log in before adding a job.
  - Displays the three most recent jobs.
  - "View All Jobs" button loads all jobs.
  - Each job card shows relevant info.
  - Individual job pages allow viewing, editing, or deleting jobs via the "Read More" button.

## 📜 License

This project is licensed under the **MIT License**.
