import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface UserDropdownTooltipProps {
  children: React.ReactNode;
}

export const UserDropdownTooltip: React.FC<UserDropdownTooltipProps> = ({
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        {children}
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
