/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  useGetBooksQuery,
  useGetContentsQuery,
} from "@/lib/redux/api/dashboardApi";

/* ------------------ Types ------------------ */

export interface TContent {
  id: number;
  image: string;
  name: string;
  title: string;
  information: string;
  description: string;
  type: string;
  link: string;
  allow_project: boolean;
  created_at: string;
}

export interface TBook {
  id: number;
  name: string;
  cover: string;
  languages: string[];
  pdfs: Record<string, string>;
}

/* ------------------ Component ------------------ */

export function UploadsClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const page = 1;
  const limit = 10;

  // Fetch content with search, page, limit
  const { data: contentsData, isLoading: isContentLoading } =
    useGetContentsQuery({
      search_term: search,
      page,
      limit,
    });

  // Fetch books with search, page, limit
  const { data: booksData, isLoading: isBookLoading } = useGetBooksQuery({
    search_term: search,
    page,
    limit,
  });

  return (
    <div className="rounded-lg border bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Uploads</h2>
        <Button
          className="bg-red-400"
          onClick={() => router.push("/upload/new-upload")}
        >
          New Upload
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search uploads..."
            className="h-10 w-full pl-9 pr-4 text-sm border rounded-md bg-background"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="books" className="p-4">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <BooksTable
            data={booksData?.data || []}
            isLoading={isBookLoading}
            onRowClick={(id) => router.push(`/upload/${id}`)}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentTable
            data={contentsData || []}
            isLoading={isContentLoading}
            onRowClick={(id) => router.push(`/upload/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ------------------ Table Components ------------------ */

function ContentTable({
  data,
  isLoading,
  onRowClick,
}: {
  data: TContent[];
  isLoading: boolean;
  onRowClick: (id: number) => void;
}) {
  if (isLoading) {
    return <p className="p-4 text-center text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-5 text-left">Image</th>
            <th className="p-5 text-left">Title</th>
            <th className="p-5 text-left">Type</th>
            <th className="p-5 text-left">Project</th>
            <th className="p-5 text-left">Created</th>
            <th className="p-5 text-left">Link</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.length ? (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick(item.id)}
                className="hover:bg-muted cursor-pointer transition"
              >
                <td className="p-5">
                  <Image
                    width={100}
                    height={100}
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded-md object-cover border"
                    unoptimized
                  />
                </td>

                <td className="p-5 font-medium">
                  <div>{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {item.information}
                  </div>
                </td>

                <td className="p-5">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                    {item.type}
                  </span>
                </td>

                <td className="p-5">
                  {item.allow_project ? (
                    <span className="text-green-600 font-medium text-xs">
                      Allowed
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Disabled
                    </span>
                  )}
                </td>

                <td className="p-5 text-muted-foreground text-xs">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                <td className="p-5">
                  <a
                    href={item.link}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline text-xs"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                No content found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BooksTable({
  data,
  isLoading,
  onRowClick,
}: {
  data: TBook[];
  isLoading: boolean;
  onRowClick: (id: number) => void;
}) {
  if (isLoading) {
    return <p className="p-4 text-center text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-5 text-left">Cover</th>
            <th className="p-5 text-left">Name</th>
            <th className="p-5 text-left">Languages</th>
            <th className="p-5 text-left">PDFs</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.length ? (
            data.map((book) => (
              <tr
                key={book.id}
                onClick={() => onRowClick(book.id)}
                className="hover:bg-muted cursor-pointer transition"
              >
                <td className="p-5">
                  <Image
                    width={100}
                    height={100}
                    src={book.cover}
                    alt={book.name}
                    className="h-14 w-10 object-cover rounded border"
                    unoptimized
                  />
                </td>

                <td className="p-5 font-medium">{book.name}</td>

                <td className="p-5">
                  <div className="flex gap-2">
                    {book.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-5">
                  <div className="flex gap-3">
                    {Object.entries(book.pdfs).map(([lang, url]) => (
                      <a
                        key={lang}
                        href={url}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:underline text-sm"
                      >
                        {lang.toUpperCase()} PDF
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-8 text-center text-muted-foreground">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
