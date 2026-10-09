import React from "react";
import { Link } from "react-router-dom";
import { PiBellSimple } from "react-icons/pi";
import { assets } from "../../assets/assets";
import { useUser } from "../../hooks/useUser";
import { isAdminRole } from "../../helpers/role";

const TopNav: React.FC = () => {
  const { user, role } = useUser();
  const displayName =
    user?.full_name || user?.first_name || user?.username || "Guest";

  return (
    <div className="w-full py-2 flex items-center justify-between gap-3">
      <img src={assets.logo} alt="Platform Logo" className="w-10" />
      <div className="flex gap-6 items-center">
        <Link to="">
          <PiBellSimple
            size={20}
            className="text-gray-600 hover:text-gray-900 transition"
          />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20 uppercase flex items-center justify-center bg-primary/10 text-primary font-medium text-xs">
            {displayName
              .split(" ")
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join("")
              .toUpperCase() || "U"}
          </div>
          <div className="leading-2">
            <h3 className="truncate m-0 font-medium text-sm">{displayName}</h3>
            <small className="uppercase font-medium text-[10px]">
              {isAdminRole(role) || user?.is_admin === 1
                ? "Administrator"
                : "Member"}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;