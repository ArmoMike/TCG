import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Combat from "./pages/Combat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CardCreationPage from "./pages/CardCreation";
import Map from "./pages/Map";
import Rules from "./pages/Rules";
import Cantcheat from "./pages/Cantcheat";
import HomeStart from "./pages/HomeStart";

const App = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/map" /> : <Navigate to="/homestart" />}
        />
        <Route path="/map" element={<Map />} />
        <Route path="/combat/:mapLevel" element={<Combat />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/map" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/map" />}
        />
        <Route path="/createcard" element={<CardCreationPage />} />
        <Route path="/cantcheat" element={<Cantcheat />} />
        <Route path="/rules" element={<Rules />} />
        <Route
          path="/homestart"
          element={!user ? <HomeStart /> : <Navigate to="/map" />}
        />
      </Routes>
    </div>
  );
};

export default App;
