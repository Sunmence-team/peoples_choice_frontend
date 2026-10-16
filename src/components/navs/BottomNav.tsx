import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { navItems, adminNavItems } from "../../lib/navItems";
import { useUser } from "../../hooks/useUser";
import { useLogout } from "../../hooks/useAuth";
import { isAdminRole } from "../../helpers/role";
import Modal from "../modal/Modal";

const shortLabel = (name: string) => name.split(" ")[0];

const BottomNav: React.FC = () => {
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const { role } = useUser();
  const logoutMutation = useLogout();

  const isAdmin = isAdminRole(role);

  const matchesRole = (allowed: string[]) =>
    allowed.includes("*") ||
    allowed.some((r) => r && r.toLowerCase() === (role?.toLowerCase() ?? ""));

  const items = (isAdmin ? adminNavItems : navItems).filter((navItem) =>
    matchesRole(navItem.role),
  );

  if (items.length === 0) return null;

  return (
    <>
      <nav className="lg:hidden shrink-0 bg-white border-t border-primary/10 shadow-[0_-6px_20px_rgba(11,45,91,0.06)] pb-[env(safe-area-inset-bottom)]">
        <ul className="flex items-stretch justify-between gap-1 px-2 py-2">
          {items.map((item, index) => (
            <li key={`${item.path}-${index}`} className="min-w-0 flex-1">
              <NavLink
                to={item.path!}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-[#66809c]"
                  }`
                }
              >
                <item.icon size={18} />
                <span className="w-full truncate text-center text-[9px] leading-none">
                  {shortLabel(item.name)}
                </span>
              </NavLink>
            </li>
          ))}

          <li className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setShowLogOutModal(true)}
              className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[#66809c] transition"
            >
              <FiLogOut size={18} />
              <span className="w-full truncate text-center text-[9px] leading-none">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {showLogOutModal && (
        <Modal onClose={() => setShowLogOutModal(false)} customMode>
          <div className="flex items-center flex-col bg-white rounded-xl py-6 px-8">
            <h3 className="font-medium text-lg text-red-700">
              Are you sure you want to logout?
            </h3>
            <div className="flex w-full mt-8 items-center gap-6">
              <button
                type="button"
                onClick={() => setShowLogOutModal(false)}
                className="bg-secondary text-xs rounded-md font-medium border border-primary/10 w-1/2 h-10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
                className="bg-red-500 text-xs rounded-md font-medium text-white w-1/2 h-10 cursor-pointer disabled:opacity-60"
              >
                {logoutMutation.isPending ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BottomNav;
