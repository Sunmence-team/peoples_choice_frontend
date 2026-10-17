import type { QuickActionProps } from "../../lib/interfaces";


export const ActionCard = ({
  icon,
  title,
  description,
  onClick,
}: QuickActionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[58px] sm:min-h-[66px] w-full items-center sm:items-start gap-2 sm:gap-2.5 rounded-lg border border-[#e3eaf2] bg-white p-2 sm:p-2.5 text-left transition hover:border-primary/30 hover:shadow-sm cursor-pointer"
    >
      <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[11px] sm:text-xs">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] sm:text-[11.5px] font-bold text-[#172b4d] leading-tight truncate">
          {title}
        </p>
        <p className="mt-0.5 text-[8.5px] sm:text-[9.5px] leading-tight text-[#8a97a8] truncate">
          {description}
        </p>
      </div>
    </button>
  );
};