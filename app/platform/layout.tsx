import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh bg-void">
      <div className="pointer-events-none fixed inset-0 bg-aurora opacity-60" />
      <div className="pointer-events-none fixed inset-0 grid-overlay opacity-30" />
      <Sidebar />
      <div className="relative flex min-h-svh flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
