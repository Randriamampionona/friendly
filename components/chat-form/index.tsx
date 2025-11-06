"use client";

import { ChangeEvent, FormEvent, useState, ClipboardEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/actions/message/send-message.action";
import { uploadImageAction } from "@/actions/message/upload-image.action";
import ImagePreview from "./image-preview";

export default function ChatForm() {
  const { userId } = useAuth();
  const [textMessage, setTextMessage] = useState("");
  const [imagePreviewUrl, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onTextMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextMessage(e.target.value);
  };

  // ✨ Handle paste event (detect image in clipboard)
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setImageFile(file);

          // Preview image before sending
          const reader = new FileReader();
          reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!textMessage.trim() && !imageFile) || !userId) return;

    setIsSubmitting(true);

    try {
      let uploadedUrl: string | null = null;

      // If an image exists, upload it first
      if (imageFile) {
        uploadedUrl = await uploadImageAction(imageFile);
      }

      // Send message with text + optional asset
      await sendMessageAction({
        sender_id: userId,
        text: textMessage,
        asset: uploadedUrl || undefined,
      });

      // Clear form
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
    <div className="pt-4">
      <form className="flex flex-col space-y-1" onSubmit={onSendMessage}>
        {/* 💜 Preview image if pasted */}
        {imagePreviewUrl && (
          <ImagePreview
            imagePreviewUrl={imagePreviewUrl}
            setImageFile={setImageFile}
            setImagePreview={setImagePreview}
          />
        )}

        <div className="flex items-center justify-between space-x-2">
          <Input
            type="text"
            placeholder="Write a message or paste an image..."
            className="flex-1 focus-visible:ring-purple-600/25"
            value={textMessage}
            onChange={onTextMessageChange}
            onPaste={onPaste}
          />
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
