"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { SearchForm } from "./SearchForm";
import { ArtifactRow } from "../recent_list/ArtifactRow";

export default function SearchPage() {
  const [searchFilters, setSearchFilters] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, refetch } = api.artifact.search.useQuery(
    searchFilters,
    {
      enabled: !!searchFilters, // Only run query when filters are set
      staleTime: 0,
    },
  );

  const handleSearch = (filters: any) => {
    if (filters === null) {
      setSearchFilters(null);
      setHasSearched(false);
    } else {
      setSearchFilters(filters);
      setHasSearched(true);
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-8 pt-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Search Artifacts</h1>
        <p className="mt-2 text-gray-400">
          Find artifacts by set, type, stats, and more
        </p>
      </div>

      <SearchForm onSearch={handleSearch} isLoading={isLoading && hasSearched} />

      {hasSearched && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-6 shadow-lg border border-slate-800">
            <div>
              <div className="text-2xl font-bold text-white">
                {data?.length ?? 0}
              </div>
              <div className="text-sm text-gray-400">Results Found</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl bg-slate-900 shadow-lg border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-3">Set</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Main Stat</th>
                    <th className="p-3 text-center">Subs</th>
                    <th className="p-3 text-center">%ATK</th>
                    <th className="p-3 text-center">%HP</th>
                    <th className="p-3 text-center">%DEF</th>
                    <th className="p-3 text-center">ATK</th>
                    <th className="p-3 text-center">HP</th>
                    <th className="p-3 text-center">DEF</th>
                    <th className="p-3 text-center">ER</th>
                    <th className="p-3 text-center">EM</th>
                    <th className="p-3 text-center">Crit Rate</th>
                    <th className="p-3 text-center">Crit DMG</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={17}
                        className="p-8 text-center text-gray-400"
                      >
                        Searching...
                      </td>
                    </tr>
                  ) : data && data.length > 0 ? (
                    data.map((artifact) => (
                      <ArtifactRow
                        key={artifact.id}
                        artifact={artifact}
                        onRefresh={refetch}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={17}
                        className="p-8 text-center text-gray-400"
                      >
                        No artifacts found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
