import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-black font-sans">
      <main className="flex flex-col items-center justify-center text-center px-6 sm:px-12">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-linear-to-r from-pink-500 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent leading-tight mb-4">
          Welcome to Friendly 💖
        </h1>

        {/* Subheading */}
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl mb-10">
          Chat, laugh, and stay connected with your favorite people — all in one
          cozy place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/sign-up"
            className="rounded-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 font-semibold text-lg transition-colors shadow-sm"
          >
            Join Now
          </Link>
          <Link
            href="/sign-in"
            className="rounded-full border border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900/30 px-8 py-3 font-medium text-lg text-pink-700 dark:text-pink-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
