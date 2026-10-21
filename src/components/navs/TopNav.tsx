import React from "react";
// import { Link } from "react-router-dom";
// import { PiBellSimple } from "react-icons/pi";
import { assets } from "../../assets/assets";
import { useUser } from "../../hooks/useUser";
import { isAdminRole } from "../../helpers/role";

const TopNav: React.FC = () => {
  const { user, role } = useUser();
  const displayName =
    user?.full_name || user?.first_name || user?.username || "Guest";

  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
      <img
        src={assets.logo}
        alt="Peoples Choice Bank Logo"
        className="w-16 sm:w-20 shrink-0"
      />
      <div className="flex gap-3 sm:gap-6 items-center">
        {/* <Link to="">
          <PiBellSimple
            size={19}
            className="text-gray-600 hover:text-gray-900 transition"
          />
        </Link> */}

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-primary/20 uppercase flex items-center justify-center bg-primary/10 text-primary font-medium text-[11px] sm:text-xs shrink-0">
            {displayName
              .split(" ")
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join("")
              .toUpperCase() || "U"}
          </div>
          <div className="leading-tight min-w-0">
            <h3 className="truncate m-0 font-medium text-xs sm:text-sm max-w-[90px] sm:max-w-[160px]">
              {displayName}
            </h3>
            <small className="uppercase font-medium text-[9px] sm:text-[10px] text-gray-400 block truncate">
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
