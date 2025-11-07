/**
 * @swagger
 * /statistics/mainstat:
 *   get:
 *     summary: Fetch statistics of main stats and types
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Statistics of artifact types and main stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                 main_stat_percentages:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 */