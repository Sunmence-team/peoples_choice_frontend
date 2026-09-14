import type { ActionCardProps } from "../../lib/interfaces";

const ActionCard = ({
    title,
    description,
    buttonText,
    icon: Icon,
    badge,
    badgeIcon: BadgeIcon,
    dark = false,
    buttonIcon: ButtonIcon,
    onClick,
}: ActionCardProps) => {
    return (
        <div
            className={`relative flex min-h-[310px] flex-col overflow-hidden rounded-lg border p-4 shadow-sm ${dark
                    ? "border-primary bg-primary text-white"
                    : "border-gray-100 bg-white text-[#07152E]"
                }`}
        >
            {/* Top section */}
            <div className="flex items-start justify-between">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${dark ? "bg-white/10" : "bg-[#F1F4FC]"
                        }`}
                >
                    <Icon
                        size={22}
                        strokeWidth={1.8}
                        className={dark ? "text-white" : "text-primary"}
                    />
                </div>

                {badge && (
                    <div
                        className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${dark
                                ? "bg-white/15 text-white"
                                : "bg-[#F7F7FA] text-[#596174]"
                            }`}
                    >
                        {BadgeIcon && <BadgeIcon size={13} />}
                        <span>{badge}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mt-4">
                <h3 className="text-[17px] font-semibold leading-tight">
                    {title}
                </h3>

                <p
                    className={`mt-1.5 max-w-[230px] text-[12px] leading-[1.55] ${dark ? "text-white/65" : "text-[#596174]"
                        }`}
                >
                    {description}
                </p>
            </div>

            {/* Button */}
            <button
                onClick={onClick}
                className={`mt-auto flex h-11 w-full items-center justify-center gap-1.5 rounded-[4px] text-[12px] font-semibold transition ${dark
                        ? "bg-white text-primary hover:bg-gray-100"
                        : "bg-[#E9ECFC] text-primary hover:bg-[#dfe4f9]"
                    }`}
            >
                {buttonText}

                {ButtonIcon && <ButtonIcon size={15} />}
            </button>

            {/* Decorative shape on dark card */}
            {dark && (
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/5" />
            )}
        </div>
    );
};

export default ActionCard;
