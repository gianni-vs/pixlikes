import "./App.css";
import React from "react";
import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, RequireAuth, Logout } from "./features/auth/useAuth";
import UnsplashDiscover from "./features/unsplash/UnsplashDiscover";
import ProfilePage from "./features/pixlikes/ProfilePage";
import LoginForm from "./features/auth/LoginForm";
import SignupForm from "./features/auth/SignupForm";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UnsplashDiscover />} />
          <Route path="profile">
            <Route path=":userId" element={<ProfilePage />} />
            <Route path="" element={<ProfilePage />} />
          </Route>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
          <Route
            path="easter-egg"
            element={
              <RequireAuth>
                <p style={{ color: "white", paddingTop: "16px" }}>
                  You've found me, congrats!
                </p>
              </RequireAuth>
            }
          />
        </Route>
        <Route path="logout" element={<Logout />}></Route>
        {/* Catch all - */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
