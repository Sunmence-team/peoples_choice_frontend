import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";

import HomeLayout from "./layout/HomeLayout";
import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/view/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp"

// Landing pages
import Home from "./pages/home/Home";
import About from "./pages/home/About";
import Features from "./pages/home/Features";
import HowItWorks from "./pages/home/HowItWorks";
import FAQ from "./pages/home/FAQ"; 

// Dashboards
import Overview from "./pages/dashboard/client/Overview";
import Profile from "./pages/dashboard/client/Profile";
import Transaction from "./pages/dashboard/client/Transaction";
import Withdrawl from "./pages/dashboard/client/Withdrawl";
import DepositRequest from "./pages/dashboard/client/Deposit";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/howitwork" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          index
          path="/dashboard/overview"
          element={<MainLayout pageName="Dashboard" children={<Overview />} />}
        />
        <Route
          index
          path="/dashboard/deposit"
          element={<MainLayout pageName="Deposit" children={<DepositRequest />} />}
        />
        <Route
          index
          path="/dashboard/profile"
          element={<MainLayout pageName="Deposit" children={<Profile />} />}
        />
        <Route
          index
          path="/dashboard/withdrawl"
          element={<MainLayout pageName="Withdrawl" children={<Withdrawl />} />}
        />
        <Route
          index
          path="/dashboard/transaction-history"
          element={<MainLayout pageName="Withdrawl" children={<Transaction />} />}
        />
      </Routes>
    </>
  );
}

export default App;
