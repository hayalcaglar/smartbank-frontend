import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { isTokenExpired } from "./utils/jwt";


const App = () => {
  const token = localStorage.getItem("token");
  const isExpired = isTokenExpired(token);

  return (
    <BrowserRouter>
      <Routes>
       <Route
  path="/"
  element={
    token && !isExpired ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route path="/login" element={<LoginPage />} />
<Route
  path="/dashboard"
  element={
    token && !isExpired ? (
      <DashboardPage />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
