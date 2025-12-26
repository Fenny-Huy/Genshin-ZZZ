import { artifactConfig } from "~/lib/constants";

// Mapping from database column keys to display labels
const SUBSTAT_KEY_TO_LABEL: Record<string, string> = {
  sub_ATK_per: "%ATK",
  sub_HP_per: "%HP",
  sub_DEF_per: "%DEF",
  sub_ATK: "ATK",
  sub_HP: "HP",
  sub_DEF: "DEF",
  sub_ER: "ER",
  sub_EM: "EM",
  sub_Crit_Rate: "Crit Rate",
  sub_Crit_DMG: "Crit DMG",
};

/**
 * Calculates overall substat statistics
 */
export const calculateSubstatOverall = (substatData: any[]) => {
  // Initialize totals
  const substatTotals: Record<string, number> = {};
  const totalSubstatCounts: Record<string, number> = {};

  // Initialize with 0
  Object.keys(SUBSTAT_KEY_TO_LABEL).forEach(key => {
    substatTotals[key] = 0;
    totalSubstatCounts[key] = 0;
  });

  substatData.forEach(item => {
    Object.keys(SUBSTAT_KEY_TO_LABEL).forEach(key => {
      const label = SUBSTAT_KEY_TO_LABEL[key];
      
      // Only count if this substat is NOT the main stat
      if (item.mainStat !== label) {
        // Add the count of this substat
        substatTotals[key] = (substatTotals[key] || 0) + (item[key] || 0);
        
        // Add to the total possible pool (total artifacts that COULD have this substat)
        // i.e., artifacts where this is not the main stat
        totalSubstatCounts[key] = (totalSubstatCounts[key] || 0) + (item.artifactCount || 0);
      }
    });
  });

  return Object.keys(substatTotals).map(key => ({
    substat: SUBSTAT_KEY_TO_LABEL[key] ?? key,
    percentage: (totalSubstatCounts[key] ?? 0) > 0 
      ? ((substatTotals[key] ?? 0) / (totalSubstatCounts[key] ?? 1)) * 100 
      : 0,
    count: substatTotals[key] ?? 0,
  }));
};

/**
 * Calculates specific substat statistics for selected type and main stat
 */
export const calculateSubstatSpecific = (
  substatData: any[], 
  selectedType: string | null, 
  selectedMainStat: string | null
) => {
  if (!selectedType || !selectedMainStat) return [];

  const data = substatData.find(
    item => item.type === selectedType && item.mainStat === selectedMainStat
  );

  if (!data) {
    return [];
  }

  return Object.keys(SUBSTAT_KEY_TO_LABEL).map(key => {
    const label = SUBSTAT_KEY_TO_LABEL[key];
    // If the substat is the same as the main stat, it can't exist as a substat
    if (label === selectedMainStat) return null;

    return {
      substat: label,
      percentage: data.substatCount > 0 
        ? (data[key] / data.substatCount) * 100 
        : 0,
      count: data[key],
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
};
