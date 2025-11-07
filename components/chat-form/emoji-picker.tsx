"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState } from "react";
import { Smile } from "lucide-react";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
};

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute right-0 top-0 z-10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-purple-100 text-purple-600 transition-all"
      >
        <Smile size={20} />
      </button>

      {open && (
        <div
          className="absolute bottom-12 -left-80 z-50 shadow-lg rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md border border-purple-100"
          onBlur={() => setOpen(!open)}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native);
            }}
            previewPosition="none"
            theme="light"
            locale="en"
          />
        </div>
      )}
    </div>
  );
}
