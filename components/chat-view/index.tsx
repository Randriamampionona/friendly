"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import MessageItem from "./message-item";
import { TChat, TMessage } from "@/typing";

export default function ChatView() {
  const [messages, setMessages] = useState<TChat>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Listen for messages in realtime
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: TChat = snapshot.docs.map((doc) => {
          const data = doc.data() as TMessage;
          return { ...data };
        });
        setMessages(msgs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔹 Auto-scroll when a new message appears
  useEffect(() => {
    if (!scrollRef.current) return;
    const behavior = messages.length <= 1 ? "auto" : "smooth";
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior,
    });
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="relative flex-1 w-full h-auto space-y-4 px-2 md:px-0 max-h-168 overflow-y-auto"
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-purple-600 py-6 animate-pulse">
          🌸 Loading chat messages...
        </div>
      )}

      {!messages.length && !isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-zinc-500 py-6 italic">
          No messages yet. Say hi! 💬
        </div>
      )}

      {!!messages.length &&
        messages.map((message, i) => <MessageItem key={i} message={message} />)}
    </div>
  );
}
