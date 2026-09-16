import { RxDashboard } from "react-icons/rx";
import {
  IoArrowDown,
  IoArrowUp,
  IoReceipt,
  IoWalletOutline
} from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { User } from "lucide-react";

export const navItems = [
  {
    name: "Dashboard",
    icon: RxDashboard,
    path: "/dashboard/overview",
    role: [""],
  },
  {
    name: "Deposit USDT",
    icon: IoArrowDown,
    path: "/dashboard/deposit",
    role: [""],
  },
  {
    name: "Withdrawl",
    icon: IoArrowUp,
    path: "/dashboard/withdrawl",
    role: [""],
  },
  {
    name: "Transaction History",
    icon: IoReceipt,
    path: "/dashboard/transaction-history",
    role: [""],
  },
  {
    name: "Profile",
    icon: User,
    path: "/dashboard/profile",
    role: [""],
  },
];

export const adminNavItems = [
  {
    name: "Dashboard",
    icon: RxDashboard,
    path: "/dashboard/admin/overview",
    role: [""],
  },
  {
    name: "Users",
    icon: LuUsersRound,
    path: "/dashboard/admin/users",
    role: [""],
  },
  {
    name: "Wallet Balances",
    icon: IoWalletOutline,
    path: "/dashboard/admin/balances",
    role: [""],
  },
  {
    name: "Deposits",
    icon: IoArrowDown,
    path: "/dashboard/admin/deposits",
    role: [""],
  },
  {
    name: "Withdrawals",
    icon: IoArrowUp,
    path: "/dashboard/admin/withdrawals",
    role: [""],
  },
  {
    name: "Transactions",
    icon: IoReceipt,
    path: "/dashboard/admin/transactions",
    role: [""],
  },
];
