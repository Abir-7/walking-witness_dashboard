// app/dashboard/layout.tsx

import Protected from "@/components/Auth/Protected";
import DashboardWrapper from "@/components/Dashboard/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardWrapper>
      <Protected>{children}</Protected>
    </DashboardWrapper>
  );
}
