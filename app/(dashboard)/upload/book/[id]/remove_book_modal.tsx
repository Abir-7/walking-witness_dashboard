import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRemoveBookLanguageMutation } from "@/lib/redux/api/dashboardWriteApi";

interface RemoveLanguageModalProps {
  open: boolean;
  onClose: () => void;
  lang: string;
  bookId: number | string;
}

const RemoveLanguageModal = ({
  open,
  onClose,
  lang,
  bookId,
}: RemoveLanguageModalProps) => {
  const [removeBookLanguage, { isLoading, error }] =
    useRemoveBookLanguageMutation();
  console.log(error);
  const handleConfirm = async () => {
    console.log(lang);
    try {
      await removeBookLanguage({
        bookId,
        lang,
      }).unwrap();

      onClose(); // close modal after success
    } catch (error) {
      console.error("Failed to remove language:", error);
      // optional: toast error here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove PDF language</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the{" "}
            <span className="font-semibold">{lang.toUpperCase()}</span> PDF?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveLanguageModal;
