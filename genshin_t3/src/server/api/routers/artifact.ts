import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself, artifactLeveling } from "~/server/db/schema";
import { eq, desc, count, and } from "drizzle-orm";

export const artifactRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const artifacts = await ctx.db.query.artifactItself.findMany({
        where: eq(artifactItself.userId, ctx.session.user.id),
        orderBy: [desc(artifactItself.createDate)],
        limit: input.limit,
        offset: offset,
        with: {
          leveling: true,
        },
      });

      const [total] = await ctx.db
        .select({ count: count() })
        .from(artifactItself)
        .where(eq(artifactItself.userId, ctx.session.user.id));

      return {
        artifacts,
        totalCount: total?.count ?? 0,
        totalPages: Math.ceil((total?.count ?? 0) / input.limit),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        set: z.string(),
        type: z.string(),
        mainStat: z.string(),
        numberOfSubstats: z.number().int().min(3).max(4),
        substats: z.array(z.string()),
        score: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(artifactItself)
        .set({
          set: input.set,
          type: input.type,
          mainStat: input.mainStat,
          numberOfSubstat: input.numberOfSubstats,
          whereGotIt: input.source,
          score: input.score,
          percentATK: input.substats.includes("%ATK") ? 1 : 0,
          percentHP: input.substats.includes("%HP") ? 1 : 0,
          percentDEF: input.substats.includes("%DEF") ? 1 : 0,
          atk: input.substats.includes("ATK") ? 1 : 0,
          hp: input.substats.includes("HP") ? 1 : 0,
          def: input.substats.includes("DEF") ? 1 : 0,
          er: input.substats.includes("ER") ? 1 : 0,
          em: input.substats.includes("EM") ? 1 : 0,
          critRate: input.substats.includes("Crit Rate") ? 1 : 0,
          critDMG: input.substats.includes("Crit DMG") ? 1 : 0,
        })
        .where(
          and(
            eq(artifactItself.id, input.id),
            eq(artifactItself.userId, ctx.session.user.id),
          ),
        );
    }),

  updateLeveling: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        lHP: z.number().default(0),
        lATK: z.number().default(0),
        lDEF: z.number().default(0),
        lPercentHP: z.number().default(0),
        lPercentATK: z.number().default(0),
        lPercentDEF: z.number().default(0),
        lEM: z.number().default(0),
        lER: z.number().default(0),
        lCritRate: z.number().default(0),
        lCritDMG: z.number().default(0),
        addedSubstat: z.string().default("None"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership via artifactItself join or just trust the ID if we check existence?
      // Better to check ownership.
      const artifact = await ctx.db.query.artifactItself.findFirst({
        where: and(
          eq(artifactItself.id, input.id),
          eq(artifactItself.userId, ctx.session.user.id),
        ),
      });

      if (!artifact) {
        throw new Error("Artifact not found or unauthorized");
      }

      await ctx.db
        .update(artifactLeveling)
        .set({
          lHP: input.lHP,
          lATK: input.lATK,
          lDEF: input.lDEF,
          lPercentHP: input.lPercentHP,
          lPercentATK: input.lPercentATK,
          lPercentDEF: input.lPercentDEF,
          lEM: input.lEM,
          lER: input.lER,
          lCritRate: input.lCritRate,
          lCritDMG: input.lCritDMG,
          addedSubstat: input.addedSubstat,
          lastAdded: new Date(),
        })
        .where(eq(artifactLeveling.id, input.id));
    }),

  create: protectedProcedure
    .input(
      z.object({
        set: z.string(),
        type: z.string(),
        mainStat: z.string(),
        numberOfSubstats: z.number().int().min(3).max(4),
        substats: z.array(z.string()),
        score: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Create the artifact entry
      const [newArtifact] = await ctx.db
        .insert(artifactItself)
        .values({
          userId: ctx.session.user.id,
          set: input.set,
          type: input.type,
          mainStat: input.mainStat,
          numberOfSubstat: input.numberOfSubstats,
          whereGotIt: input.source,
          score: input.score,
          // Map substats array to individual columns
          percentATK: input.substats.includes("%ATK") ? 1 : 0,
          percentHP: input.substats.includes("%HP") ? 1 : 0,
          percentDEF: input.substats.includes("%DEF") ? 1 : 0,
          atk: input.substats.includes("ATK") ? 1 : 0,
          hp: input.substats.includes("HP") ? 1 : 0,
          def: input.substats.includes("DEF") ? 1 : 0,
          er: input.substats.includes("ER") ? 1 : 0,
          em: input.substats.includes("EM") ? 1 : 0,
          critRate: input.substats.includes("Crit Rate") ? 1 : 0,
          critDMG: input.substats.includes("Crit DMG") ? 1 : 0,
        })
        .returning({ id: artifactItself.id });

      if (!newArtifact) {
        throw new Error("Failed to create artifact");
      }

      // 2. Create the corresponding leveling entry (initialized to 0s)
      await ctx.db.insert(artifactLeveling).values({
        id: newArtifact.id,
        lHP: 0,
        lATK: 0,
        lDEF: 0,
        lPercentHP: 0,
        lPercentATK: 0,
        lPercentDEF: 0,
        lEM: 0,
        lER: 0,
        lCritRate: 0,
        lCritDMG: 0,
        addedSubstat: "None",
      });

      return newArtifact;
    }),
});
