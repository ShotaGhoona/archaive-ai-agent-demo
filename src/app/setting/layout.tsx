import SettingSidebar from "@/shared/basic-layout/ui/SettingSidebar";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-45px)] bg-background">
      <SettingSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}