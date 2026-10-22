import React from "react";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import {
  IoArrowDown,
  IoReceipt,
  IoSwapHorizontal,
  IoWalletOutline,
} from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { CreditCard, Landmark, User } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { isAdminRole } from "../../helpers/role";

const clientBottomNavItems = [
  {
    name: "Home",
    icon: RxDashboard,
    path: "/dashboard/overview",
  },
  {
    name: "Transfer",
    icon: IoSwapHorizontal,
    path: "/dashboard/transfer",
  },
  {
    name: "Loans",
    icon: Landmark,
    path: "/dashboard/loans",
  },
  {
    name: "Cards",
    icon: CreditCard,
    path: "/dashboard/cards",
  },
  {
    name: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
];

const adminBottomNavItems = [
  {
    name: "Home",
    icon: RxDashboard,
    path: "/dashboard/admin/overview",
  },
  {
    name: "Users",
    icon: LuUsersRound,
    path: "/dashboard/admin/users",
  },
  {
    name: "Wallets",
    icon: IoWalletOutline,
    path: "/dashboard/admin/balances",
  },
  {
    name: "Deposits",
    icon: IoArrowDown,
    path: "/dashboard/admin/deposits",
  },
  {
    name: "History",
    icon: IoReceipt,
    path: "/dashboard/admin/transactions",
  },
];

const BottomNav: React.FC = () => {
  const { role } = useUser();
  const isAdmin = isAdminRole(role);
  const items = isAdmin ? adminBottomNavItems : clientBottomNavItems;

  return (
    <nav className="lg:hidden shrink-0 bg-primary border-t border-primary/10 shadow-[0_-4px_16px_rgba(11,45,91,0.05)] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-center justify-around px-2 py-2.5">
        {items.map((item) => (
          <li key={item.path} className="flex-1 max-w-[80px]">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-all ${
                  isActive
                    ? "text-white font-bold bg-white/10"
                    : "text-[#66809c] hover:text-white font-medium"
                }`
              }
            >
              <item.icon size={19} />
              <span className="text-[12px] mt-0.5 tracking-tight truncate max-w-full">
                {item.name}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
