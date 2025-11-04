import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex items-center justify-center min-h-screen max-w-full">
      <SignUp />
    </main>
  );
}
