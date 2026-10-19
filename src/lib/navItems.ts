import { RxDashboard } from "react-icons/rx";
import {
  IoArrowDown,
  IoArrowUp,
  IoReceipt,
  IoWalletOutline,
  IoSwapHorizontal,
} from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { User, Landmark, Gift, CreditCard, ShieldCheck } from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    icon: RxDashboard,
    path: "/dashboard/overview",
    role: ["*"],
  },
  {
    name: "Cards & Digital Wallets",
    icon: CreditCard,
    path: "/dashboard/cards",
    role: ["*"],
  },
  {
    name: "Identity (KYC)",
    icon: ShieldCheck,
    path: "/dashboard/kyc",
    role: ["*"],
  },
  {
    name: "Loans & Credit",
    icon: Landmark,
    path: "/dashboard/loans",
    role: ["*"],
  },
  {
    name: "Referral History",
    icon: Gift,
    path: "/dashboard/referrals",
    role: ["*"],
  },
  {
    name: "Transfer Money",
    icon: IoSwapHorizontal,
    path: "/dashboard/transfer",
    role: ["*"],
  },
  {
    name: "Deposit Funds",
    icon: IoArrowDown,
    path: "/dashboard/deposit",
    role: ["*"],
  },
  {
    name: "Withdraw / Payout",
    icon: IoArrowUp,
    path: "/dashboard/withdrawl",
    role: ["*"],
  },
  {
    name: "Transaction History",
    icon: IoReceipt,
    path: "/dashboard/transaction-history",
    role: ["*"],
  },
  {
    name: "Profile & Settings",
    icon: User,
    path: "/dashboard/profile",
    role: ["*"],
  },
];

export const adminNavItems = [
  {
    name: "Dashboard",
    icon: RxDashboard,
    path: "/dashboard/admin/overview",
    role: ["*"],
  },
  {
    name: "Users",
    icon: LuUsersRound,
    path: "/dashboard/admin/users",
    role: ["*"],
  },
  {
    name: "Identity (KYC)",
    icon: ShieldCheck,
    path: "/dashboard/admin/kyc",
    role: ["*"],
  },
  {
    name: "Wire Transfers",
    icon: IoSwapHorizontal,
    path: "/dashboard/admin/transfers",
    role: ["*"],
  },
  {
    name: "Withdrawals",
    icon: IoArrowUp,
    path: "/dashboard/admin/withdrawals",
    role: ["*"],
  },
  {
    name: "Card Approvals",
    icon: CreditCard,
    path: "/dashboard/admin/cards",
    role: ["*"],
  },
  {
    name: "Loan Disbursements",
    icon: Landmark,
    path: "/dashboard/admin/loans",
    role: ["*"],
  },
  {
    name: "Referral Oversight",
    icon: Gift,
    path: "/dashboard/admin/referrals",
    role: ["*"],
  },
  {
    name: "Company Wallets",
    icon: IoWalletOutline,
    path: "/dashboard/admin/balances",
    role: ["*"],
  },
  {
    name: "Deposits",
    icon: IoArrowDown,
    path: "/dashboard/admin/deposits",
    role: ["*"],
  },
  {
    name: "Transactions",
    icon: IoReceipt,
    path: "/dashboard/admin/transactions",
    role: ["*"],
  },
];
