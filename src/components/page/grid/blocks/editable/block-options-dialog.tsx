import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface BlockOptionsDialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BlockOptionsDialog: React.FC<BlockOptionsDialogProps> = ({
  title,
  children,
  isOpen,
  setIsOpen,
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
      <DialogTitle>{title}</DialogTitle>
      {children}
    </DialogContent>
  </Dialog>
);
