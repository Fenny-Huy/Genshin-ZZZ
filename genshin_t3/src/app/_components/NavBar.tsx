import Link from "next/link";
import { auth } from "~/server/auth";

export async function NavBar() {
  const session = await auth();

  return (
    <nav className="bg-slate-900 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-yellow-500">
          Genshin Artifacts
        </Link>
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <span className="text-sm text-gray-400">
                Welcome, {session.user?.name}
              </span>
              <Link href="/api/auth/signout" className="hover:text-yellow-400 transition-colors">
                Sign Out
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin" className="hover:text-yellow-400 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
