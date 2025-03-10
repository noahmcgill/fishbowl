import { AddWidgetDropdown } from "./add-widget-dropdown";
import { UserDropdown } from "./user-dropdown";

export const Menu = () => {
  return (
    <div className="fixed bottom-[35px] left-0 right-0 mx-[60px] flex justify-between bg-white p-[10px]">
      <UserDropdown />
      <AddWidgetDropdown />
    </div>
  );
};
