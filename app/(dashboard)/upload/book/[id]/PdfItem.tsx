import { Book, X } from "lucide-react";
import RemoveLanguageModal from "./remove_book_modal";
import { useState } from "react";

interface PdfItemProps {
  lang: string;
  url: string;
  bookId: number | string;
}

const PdfItem = ({ lang, url, bookId }: PdfItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-md bg-red-400 px-4 py-2 text-white">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium hover:underline"
        >
          <Book className="h-4 w-4" />
          {lang.toUpperCase()} PDF
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full p-1 hover:bg-black/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <RemoveLanguageModal
        open={open}
        onClose={() => setOpen(false)}
        lang={lang}
        bookId={bookId}
      />
    </>
  );
};

export default PdfItem;
