import ChatForm from "@/components/chat-form";
import ChatView from "@/components/chat-view";

export default function page() {
  return (
    <main className=" flex flex-col w-full md:w-md lg:w-lg xl:w-2xl mx-auto min-h-dvh max-h-dvh h-full py-4">
      <ChatView />
      <ChatForm />
    </main>
  );
}
