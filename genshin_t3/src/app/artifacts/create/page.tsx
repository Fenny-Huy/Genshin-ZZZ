import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import ArtifactCreateForm from "./ArtifactCreateForm";

export default async function ArtifactCreatePage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Create New <span className="text-[hsl(280,100%,70%)]">Artifact</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Add a new artifact to your collection with detailed stats and substats
          </p>
        </div>
        
        <ArtifactCreateForm />
      </div>
    </main>
  );
}
