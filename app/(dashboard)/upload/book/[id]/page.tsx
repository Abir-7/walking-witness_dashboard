// app/upload/book/[id]/page.tsx
"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetBookQuery } from "@/lib/redux/api/dashboardApi";

import DashboardHeader from "@/components/Dashboard/Shared/DashboardHeader";
import PdfItem from "./PdfItem";
import AddPdfModal from "./add_new_book";

export interface TBook {
  id: number;
  name: string;
  cover: string;
  languages: string[];
  pdfs: Record<string, string>;
}

const BookDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: book,
    isLoading,
    isError,
  } = useGetBookQuery(id!, {
    skip: !id,
  });

  if (!id)
    return <p className="p-4 text-center text-red-500">Invalid Book ID</p>;
  if (isLoading)
    return <p className="p-4 text-center text-muted-foreground">Loading...</p>;
  if (isError || !book)
    return <p className="p-4 text-center text-red-500">Book not found</p>;

  const pdfEntries = Object.entries(book.pdfs ?? {});

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Book Details"
        description="All information and downloads for this book."
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cover */}
          <div className="relative h-96 rounded-xl overflow-hidden  bg-white">
            <Image
              src={book.cover}
              alt={book.name}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {book.name}
            </h1>

            {/* Languages */}
            {book.languages?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Available Languages
                  </h3>
                  <AddPdfModal bookId={book.id}></AddPdfModal>
                </div>
                <div className="flex flex-wrap gap-2">
                  {book.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-full bg-red-100 text-red-400 text-sm font-medium"
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* PDFs */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Downloads
              </h3>

              {pdfEntries.length === 0 ? (
                <p className="text-sm text-gray-500">No PDFs available</p>
              ) : (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  {pdfEntries.map(([lang, url]) => (
                    <PdfItem
                      key={lang}
                      lang={lang}
                      url={url as string}
                      bookId={book.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optional: description section */}
        {/* {book.description && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Description
            </h3>
            <p className="text-gray-700">{book.description}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BookDetailsPage;
