export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-full w-full px-[70px] pt-[70px]">{children}</div>
  );
}
