import { SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type TProps = {
  imagePreviewUrl: string;
  setImagePreview: (value: SetStateAction<string | null>) => void;
  setImageFile: (value: SetStateAction<File | null>) => void;
};

export default function ImagePreview({
  imagePreviewUrl,
  setImageFile,
  setImagePreview,
}: TProps) {
  return (
    <div className="relative w-28 h-auto overflow-hidden rounded-lg border border-purple-200">
      <img
        src={imagePreviewUrl}
        alt="Preview"
        className="w-full h-auto object-cover"
      />
      <Button
        type="button"
        onClick={() => {
          setImagePreview(null);
          setImageFile(null);
        }}
        size={"icon"}
        className="absolute top-1 right-1 bg-white/70 text-purple-600 rounded-full text-xs w-6 h-6 shadow hover:bg-white"
      >
        <X />
      </Button>
    </div>
  );
}
