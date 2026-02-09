"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadBook from "./UploadBook";

import DashboardHeader from "../Shared/DashboardHeader";

import UploadCategory from "./UploadCategory";
import UploadLanguage from "./UploadLanguage";

const UploadAny = () => {
  // Load initial tab from localStorage or default to "book"
  const [activeTab, setActiveTab] = useState<"book" | "category" | "language">(
    () => {
      if (typeof window !== "undefined") {
        return (
          (localStorage.getItem("activeTab") as
            | "book"
            | "category"
            | "language") || "book"
        );
      }
      return "book";
    },
  );

  // Update localStorage whenever activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Function to get dynamic title/description based on tab
  const getHeader = () => {
    switch (activeTab) {
      case "book":
        return {
          title: "Upload",
          description: "View and manage all uploaded book files.",
        };
      case "category":
        return {
          title: "Upload Content",
          description: "View and manage all uploaded content files.",
        };
      case "language":
        return {
          title: "Upload Language",
          description: "View and manage all uploaded language files.",
        };
    }
  };

  const header = getHeader();

  return (
    <>
      <DashboardHeader title={header.title} description={header.description} />
      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs
          value={activeTab}
          onValueChange={(val) =>
            setActiveTab(val as "book" | "category" | "language")
          }
          className="w-full"
        >
          <TabsList className="mb-4 h-10 w-full">
            <TabsTrigger value="book">Book</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <UploadBook />
          </TabsContent>
          <TabsContent value="category">
            <UploadCategory></UploadCategory>
          </TabsContent>
          <TabsContent value="language">
            {/* Add your language content component here */}
            <UploadLanguage></UploadLanguage>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UploadAny;
