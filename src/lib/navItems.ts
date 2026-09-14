import { RxDashboard } from "react-icons/rx";
import {
  IoArrowDown,
  IoArrowUp,
  IoReceipt
} from "react-icons/io5";

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
];
