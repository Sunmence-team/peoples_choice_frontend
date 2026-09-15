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

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          index
          path="/"
          element={<HomeLayout  >
            <Home/>
          </HomeLayout>}
        />
        <Route path="/login" element={<Login />} />
        <Route
          index
          path="/dashboard/overview"
          element={<MainLayout pageName="Dashboard" children={<Overview />} />}
        />
      </Routes>
    </>
  );
}

export default App;
