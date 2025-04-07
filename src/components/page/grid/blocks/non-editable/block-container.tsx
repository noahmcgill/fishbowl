interface BlockContainerProps {
  blockKey: string;
  children: React.ReactNode;
  isTitle?: boolean;
}

export const BlockContainer: React.FC<BlockContainerProps> = ({
  blockKey,
  children,
  isTitle = false,
}) => {
  return (
    <div
      className={`flex h-full w-full cursor-default flex-col justify-center gap-2 rounded-3xl border-[1px] active:bg-white ${!isTitle ? "border-slate-200 p-6 shadow-[0_2px_4px_rgba(0,0,0,.04)]" : "shadow-0 border-white px-4 py-1"}`}
      key={blockKey}
    >
      {children}
    </div>
  );
};
