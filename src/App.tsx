import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";

import HomeLayout from "./layout/HomeLayout";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./helpers/ProtectRoute";
import NotFound from "./pages/view/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

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

// Admin Dashboards
import AdminOverview from "./pages/dashboard/admin/Overview";
import AdminUsers from "./pages/dashboard/admin/Users";
import AdminBalances from "./pages/dashboard/admin/Balances";
import AdminDeposits from "./pages/dashboard/admin/Deposits";
import AdminWithdrawals from "./pages/dashboard/admin/Withdrawals";
import AdminTransactions from "./pages/dashboard/admin/Transactions";

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
          path="/dashboard/overview"
          element={
            <ProtectedRoute>
              <MainLayout pageName="Dashboard">
                <Overview />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/deposit"
          element={
            <ProtectedRoute>
              <MainLayout pageName="Deposit">
                <DepositRequest />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <MainLayout pageName="Profile">
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/withdrawl"
          element={
            <ProtectedRoute>
              <MainLayout pageName="Withdraw">
                <Withdrawl />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/transaction-history"
          element={
            <ProtectedRoute>
              <MainLayout pageName="Transaction History">
                <Transaction />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/overview"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="Admin Dashboard">
                <AdminOverview />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="User Management">
                <AdminUsers />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/balances"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="Company Wallets">
                <AdminBalances />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/deposits"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="Deposit Requests">
                <AdminDeposits />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/withdrawals"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="Withdrawal Requests">
                <AdminWithdrawals />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/transactions"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout pageName="Transactions">
                <AdminTransactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
