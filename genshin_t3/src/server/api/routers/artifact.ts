import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself, artifactLeveling } from "~/server/db/schema";

export const artifactRouter = createTRPCRouter({
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
