export default async function PageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full w-full px-[40px] pt-[40px] min-[1360px]:px-[70px] min-[1360px]:pt-[70px]">
      {children}
    </div>
  );
}
