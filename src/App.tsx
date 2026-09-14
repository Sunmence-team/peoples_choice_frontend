import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";

import HomeLayout from "./layout/HomeLayout";
import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/view/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";

// Landing pages
import Home from "./pages/home/Home";

// Dashboards
import Overview from "./pages/dashboard/client/Overview";
import Profile from "./pages/dashboard/client/Profile";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          index
          path="/"
          element={<HomeLayout pageName="Home" children={<Home />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          index
          path="/dashboard/overview"
          element={<MainLayout pageName="Dashboard" children={<Overview />} />}
        />
        <Route
          index
          path="/dashboard/deposit"
          element={<MainLayout pageName="Deposit" children={<Overview />} />}
        />
        <Route
          index
          path="/dashboard/profile"
          element={<MainLayout pageName="Deposit" children={<Profile />} />}
        />
        <Route
          index
          path="/dashboard/withdrawl"
          element={<MainLayout pageName="Withdrawl" children={<Overview />} />}
        />
        <Route
          index
          path="/dashboard/transaction-history"
          element={<MainLayout pageName="Withdrawl" children={<Overview />} />}
        />
      </Routes>
    </>
  );
}

export default App;
