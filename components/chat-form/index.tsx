"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  ClipboardEvent,
  useLayoutEffect,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/actions/message/send-message.action";
import { uploadImageAction } from "@/actions/message/upload-image.action";
import ImagePreview from "./image-preview";
import EmojiPicker from "./emoji-picker";

export default function ChatForm() {
  const { userId } = useAuth();
  const [textMessage, setTextMessage] = useState("");
  const [imagePreviewUrl, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const caretPositionRef = useRef<number | null>(null);

  const onTextMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextMessage(e.target.value);
  };

  // ✨ Handle paste image from clipboard
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // 💜 Insert emoji where the cursor currently is
  const handleEmojiSelect = (emoji: string) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    // Insert emoji exactly at the caret position
    const newValue =
      textMessage.substring(0, start) + emoji + textMessage.substring(end);

    // Save position so we can restore it right after re-render
    caretPositionRef.current = start + emoji.length;

    setTextMessage(newValue);
    input.focus();
  };

  // 🪄 Restore caret position immediately after value changes
  useLayoutEffect(() => {
    if (
      inputRef.current &&
      caretPositionRef.current !== null &&
      document.activeElement === inputRef.current
    ) {
      inputRef.current.setSelectionRange(
        caretPositionRef.current,
        caretPositionRef.current
      );
      caretPositionRef.current = null;
    }
  }, [textMessage]);

  const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!textMessage.trim() && !imageFile) || !userId) return;

    setIsSubmitting(true);
    try {
      let uploadedUrl: string | null = null;
      if (imageFile) uploadedUrl = await uploadImageAction(imageFile);

      await sendMessageAction({
        sender_id: userId,
        text: textMessage,
        asset: uploadedUrl || undefined,
      });

      setTextMessage("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 px-2 md:px-0">
      <form className="flex flex-col space-y-1" onSubmit={onSendMessage}>
        {imagePreviewUrl && (
          <ImagePreview
            imagePreviewUrl={imagePreviewUrl}
            setImageFile={setImageFile}
            setImagePreview={setImagePreview}
          />
        )}

        <div className="flex items-center justify-between space-x-2">
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Write a message or paste an image..."
              className="flex-1 focus-visible:ring-purple-600/25"
              value={textMessage}
              onChange={onTextMessageChange}
              onPaste={onPaste}
            />

            <EmojiPicker onSelect={handleEmojiSelect} />
          </div>

          <Button
            type="submit"
            disabled={(!textMessage && !imageFile) || isSubmitting}
            className="bg-purple-600 hover:bg-purple-500 transition-all"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
