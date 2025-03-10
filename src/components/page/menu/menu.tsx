import { UserDropdown } from "./user-dropdown";

export const Menu = () => {
  return (
    <div className="fixed bottom-[35px] left-0 right-0 mx-[60px] flex bg-white p-[10px]">
      <UserDropdown />
    </div>
  );
};
