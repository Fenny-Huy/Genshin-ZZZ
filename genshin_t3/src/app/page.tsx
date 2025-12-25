import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Genshin <span className="text-[hsl(280,100%,70%)]">Artifact</span> Manager
          </h1>
          
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-2xl text-white max-w-2xl">
              Welcome to the ultimate tool for managing and optimizing your Genshin Impact artifacts. 
              Track your rolls, calculate scores, and organize your inventory efficiently.
            </p>
            
            {!session && (
              <div className="mt-8">
                <p className="mb-4 text-lg text-gray-300">Sign in to start managing your collection</p>
                <Link
                  href="/api/auth/signin"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                  Sign in with Discord or Google
                </Link>
              </div>
            )}

            {session && (
               <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/artifacts/create"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                >
                  <h3 className="text-2xl font-bold">Add Artifact →</h3>
                  <div className="text-lg">
                    Record a new artifact into your database.
                  </div>
                </Link>
                <Link
                  href="/artifacts"
                  className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                >
                  <h3 className="text-2xl font-bold">View Collection →</h3>
                  <div className="text-lg">
                    Browse, search, and filter your artifact inventory.
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
