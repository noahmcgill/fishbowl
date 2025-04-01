interface BlockContainerProps {
  blockKey: string;
  children: React.ReactNode;
}

export const BlockContainer: React.FC<BlockContainerProps> = ({
  blockKey,
  children,
}) => {
  return (
    <div
      className="flex h-full w-full cursor-default flex-col justify-center gap-2 rounded-3xl border-[1px] border-slate-200 p-8 shadow-[0_2px_4px_rgba(0,0,0,.04)] active:bg-white"
      key={blockKey}
    >
      {children}
    </div>
  );
};
