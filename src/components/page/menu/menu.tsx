import { AddWidgetDropdown } from "./add-widget/add-widget-dropdown";
import { UserDropdown } from "./user-dropdown";

interface MenuProps {
  pageId: string;
}

export const Menu: React.FC<MenuProps> = ({ pageId }) => {
  return (
    <div className="fixed bottom-[35px] left-0 right-0 mx-[60px] flex justify-between bg-white p-[10px]">
      <UserDropdown />
      <AddWidgetDropdown pageId={pageId} />
    </div>
  );
};
