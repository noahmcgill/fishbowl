import { LuCircleAlert, LuCircleCheck, LuLoader } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

interface ClaimLinkStatusIconProps {
  initialized: boolean;
  slugExists: boolean;
  isLoading: boolean;
  disabled: boolean;
}

export const ClaimLinkStatusIcon: React.FC<ClaimLinkStatusIconProps> = ({
  initialized,
  slugExists,
  isLoading,
  disabled,
}) => {
  if (!initialized) return null;

  const status = isLoading
    ? "loading"
    : slugExists || disabled
      ? "error"
      : "success";

  const statusConfig = {
    loading: {
      icon: <LuLoader className="animate-spin" />,
      message: "Checking to see if this link is available.",
    },
    error: {
      icon: <LuCircleAlert className="text-red-600" />,
      message: "Sorry, this link is unavailable.",
    },
    success: {
      icon: <LuCircleCheck className="text-green-600" />,
      message: "This link is available!",
    },
  };

  return (
    <span className="absolute inset-y-0 right-0 flex items-center text-sm text-zinc-800">
      <Tooltip>
        <TooltipTrigger asChild>{statusConfig[status].icon}</TooltipTrigger>
        <TooltipContent>
          <p>{statusConfig[status].message}</p>
        </TooltipContent>
      </Tooltip>
    </span>
  );
};
