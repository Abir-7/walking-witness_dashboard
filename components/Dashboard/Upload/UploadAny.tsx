"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadBook from "./UploadBook";
import UploadContent from "./UploadContent";
import DashboardHeader from "../Shared/DashboardHeader";

const UploadAny = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState<"book" | "content">("book");

  // Function to get dynamic title/description based on tab
  const getHeader = () => {
    if (activeTab === "book") {
      return {
        title: "Upload Books",
        description: "View and manage all uploaded book files.",
      };
    } else {
      return {
        title: "Upload Content",
        description: "View and manage all uploaded content files.",
      };
    }
  };

  const header = getHeader();

  return (
    <>
      <DashboardHeader title={header.title} description={header.description} />
      <div className="flex w-full flex-col gap-6 p-5">
        <UploadBook />
      </div>
    </>
  );
};

export default UploadAny;
