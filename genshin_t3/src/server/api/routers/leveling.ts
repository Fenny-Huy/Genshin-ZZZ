import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself, artifactLeveling } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const levelingRouter = createTRPCRouter({
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
        .insert(artifactLeveling)
        .values({
          id: input.id,
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
        .onConflictDoUpdate({
          target: artifactLeveling.id,
          set: {
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
          },
        });
    }),
});
