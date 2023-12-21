import "./App.css";
import { useState } from "react";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingContext from "./context/LoadingContext";
import UserContext from "./context/UserContext";
import MainPage from "./pages/MainPage";
import SetAvatar from "./component/Main/SetAvatar";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute'
import LandingPage from "./pages/LandingPage";
// require("dotenv").config();

function App() {
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");

  return (
    <div className="App ">
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <UserContext.Provider value={{ userID, setUserID }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/setAvatar" element={<SetAvatar />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </LoadingContext.Provider>
    </div>
  );
}

export default App;