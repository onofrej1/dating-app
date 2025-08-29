import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import UserNav from "@/components/layout/user-nav";
import { Input } from "@/components/ui/input";
import CommonBreadcrumbs from "@/components/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between p-3  border-b">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <CommonBreadcrumbs />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search" />
            <UserNav />
          </div>
        </div>
        <div className="p-3">{children}</div>
      </main>
    </SidebarProvider>
  );
}
