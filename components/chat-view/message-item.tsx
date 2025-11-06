import { TMessage } from "@/typing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

type TProps = {
  message: TMessage;
};

export default function MessageItem({ message }: TProps) {
  const { user } = useUser();
  const isOwn = message.sender_id === user?.id;

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* 💜 Avatar — always visible */}
      <Avatar
        className={`size-8 border-2 shadow-sm ${
          isOwn ? "order-2 border-purple-200" : "order-1 border-rose-100"
        }`}
      >
        <AvatarImage src={message.avatar_url} />
        <AvatarFallback
          className={`${
            isOwn ? "bg-purple-100 text-purple-600" : "bg-rose-50 text-rose-400"
          } font-semibold`}
        >
          {message.username?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* 💬 Message bubble */}
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm relative overflow-hidden ${
          isOwn
            ? "bg-purple-200 text-purple-900 rounded-br-none order-1"
            : "bg-rose-50 text-rose-800 rounded-bl-none order-2"
        }`}
      >
        {/* Text */}
        {message.text && (
          <p className="wrap-break-word leading-relaxed mb-1">{message.text}</p>
        )}

        {/* 🌸 Image (if present) */}
        {message.asset && (
          <div className="mt-2 overflow-hidden rounded-lg border border-white/30 shadow-sm">
            <Image
              src={message.asset}
              alt="sent image"
              width={300}
              height={300}
              className="rounded-lg object-cover max-h-72"
            />
          </div>
        )}

        {/* Time */}
        <p
          className={`text-[11px] mt-2 text-right ${
            isOwn ? "text-purple-600/70" : "text-rose-400"
          }`}
        >
          {message.timestamp?.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
