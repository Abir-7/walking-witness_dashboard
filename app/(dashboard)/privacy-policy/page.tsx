// app\(dashboard)\privacy-policy\page.tsx
import PrivacyPolicyList from "@/components/Dashboard/PrivacyPolicy/PolicyList";
import PrivacyPolicyClient from "@/components/Dashboard/PrivacyPolicy/PrivacyPolicyClient";
import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function PrivacyPolicyPage() {
  return (
    <div className="">
      <DashboardHeader
        title="Privacy Policy"
        description="View and update"
      ></DashboardHeader>

      <div className="p-4">
        <div className="flex w-full  flex-col gap-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">All Privacy</TabsTrigger>
              <TabsTrigger value="password">Add New</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <PrivacyPolicyList></PrivacyPolicyList>
            </TabsContent>
            <TabsContent value="password">
              <PrivacyPolicyClient />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
