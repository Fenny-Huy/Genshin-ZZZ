import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself } from "~/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const statisticsRouter = createTRPCRouter({
  getMainStats: protectedProcedure
    .input(
      z.object({
        set: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(artifactItself.userId, ctx.session.user.id)];
      if (input.set) {
        conditions.push(eq(artifactItself.set, input.set));
      }

      // 1. Get Type Distribution
      const typeStats = await ctx.db
        .select({
          type: artifactItself.type,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(artifactItself)
        .where(and(...conditions))
        .groupBy(artifactItself.type);

      const totalArtifacts = typeStats.reduce((acc, curr) => acc + curr.count, 0);
      
      const typePercentages = typeStats.map((stat) => ({
        substat: stat.type, // Using 'substat' key to match frontend expectation for label
        count: stat.count,
        percentage: totalArtifacts > 0 ? (stat.count / totalArtifacts) * 100 : 0,
      }));

      // 2. Get Main Stat Distribution (grouped by Type and MainStat)
      const mainStats = await ctx.db
        .select({
          type: artifactItself.type,
          mainStat: artifactItself.mainStat,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(artifactItself)
        .where(and(...conditions))
        .groupBy(artifactItself.type, artifactItself.mainStat);

      // We need to calculate percentages relative to the total count of that specific TYPE
      // But the original code seemed to calculate percentage relative to the specific type group?
      // Let's look at the original SQL:
      // SELECT "Type", "Main_Stat", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Type" = t."Type")
      
      // So we need the total count per type to calculate the percentage correctly.
      const countByType: Record<string, number> = {};
      typeStats.forEach(t => {
        if (t.type) countByType[t.type] = t.count;
      });

      const mainStatPercentages = mainStats.map((stat) => {
        const typeTotal = stat.type ? countByType[stat.type] || 0 : 0;
        return {
          type: stat.type,
          substat: stat.mainStat, // Using 'substat' key for label
          count: stat.count,
          percentage: typeTotal > 0 ? (stat.count / typeTotal) * 100 : 0,
        };
      });

      return {
        typePercentages,
        mainStatPercentages,
      };
    }),

  getSubstats: protectedProcedure
    .input(
      z.object({
        set: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(artifactItself.userId, ctx.session.user.id)];
      if (input.set) {
        conditions.push(eq(artifactItself.set, input.set));
      }

      // We need to aggregate substat counts grouped by Type and MainStat
      // The original SQL query summed up the boolean flags (0 or 1) for each substat
      // In our schema, we have integer columns for substats (0 or 1)
      
      const result = await ctx.db
        .select({
          type: artifactItself.type,
          mainStat: artifactItself.mainStat,
          artifactCount: sql<number>`count(*)`.mapWith(Number),
          
          // Summing up the presence of each substat
          sub_ATK_per: sql<number>`sum(${artifactItself.percentATK})`.mapWith(Number),
          sub_HP_per: sql<number>`sum(${artifactItself.percentHP})`.mapWith(Number),
          sub_DEF_per: sql<number>`sum(${artifactItself.percentDEF})`.mapWith(Number),
          sub_ATK: sql<number>`sum(${artifactItself.atk})`.mapWith(Number),
          sub_HP: sql<number>`sum(${artifactItself.hp})`.mapWith(Number),
          sub_DEF: sql<number>`sum(${artifactItself.def})`.mapWith(Number),
          sub_ER: sql<number>`sum(${artifactItself.er})`.mapWith(Number),
          sub_EM: sql<number>`sum(${artifactItself.em})`.mapWith(Number),
          sub_Crit_Rate: sql<number>`sum(${artifactItself.critRate})`.mapWith(Number),
          sub_Crit_DMG: sql<number>`sum(${artifactItself.critDMG})`.mapWith(Number),
          
          // Total count of all substats combined
          substatCount: sql<number>`sum(
            ${artifactItself.percentATK} + ${artifactItself.percentHP} + ${artifactItself.percentDEF} + 
            ${artifactItself.atk} + ${artifactItself.hp} + ${artifactItself.def} + 
            ${artifactItself.er} + ${artifactItself.em} + 
            ${artifactItself.critRate} + ${artifactItself.critDMG}
          )`.mapWith(Number),
        })
        .from(artifactItself)
        .where(and(...conditions))
        .groupBy(artifactItself.type, artifactItself.mainStat);

      return result;
    }),

  getAvailableSets: protectedProcedure.query(async ({ ctx }) => {
    const sets = await ctx.db
      .selectDistinct({ set: artifactItself.set })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .orderBy(artifactItself.set);
      
    return sets
      .map((s) => s.set)
      .filter((s): s is string => s !== null);
  }),
});
