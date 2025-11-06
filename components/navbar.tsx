"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <nav className="fixed top-2 right-2 z-10">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
