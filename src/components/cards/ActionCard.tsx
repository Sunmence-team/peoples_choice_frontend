import type { QuickActionProps } from "../../lib/interfaces";


export const ActionCard = ({
  icon,
  title,
  description,
  onClick,
}: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[78px] w-full items-start gap-3 rounded-xl border border-[#e3eaf2] bg-white p-3 text-left transition hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[12px] font-bold text-[#172b4d]">{title}</p>
        <p className="mt-1 text-[9px] leading-3 text-[#8a97a8]">
          {description}
        </p>
      </div>
    </button>
  );
};