import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";
import SetSourceSection from "./_components/SetSourceSection";

export default async function SubStatisticsPage() {
  const setData = await api.substatistics.getSetData();
  const sourceData = await api.substatistics.getSourceData();
  const setSourceComboData = await api.substatistics.getSetSourceComboData();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white">
        <div className="container flex flex-col gap-8 px-4 py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sub-Statistics
            </h1>
            <p className="text-lg text-gray-400">
              Detailed breakdown of artifact sets, sources, and scores.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4 rounded-xl bg-slate-900/50 p-6 border border-slate-800">
              <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-4">
                Set & Source Distribution
              </h2>
              <SetSourceSection 
                setData={setData}
                sourceData={sourceData}
                setSourceComboData={setSourceComboData}
              />
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
