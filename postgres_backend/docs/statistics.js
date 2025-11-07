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
/**
 * @swagger
 * /statistics/mainstat/{setname}:
 *   get:
 *     summary: Fetch statistics of main stats and types for a specific set
 *     tags:
 *       - Statistics
 *     parameters:
 *       - in: path
 *         name: setname
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the artifact set
 *     responses:
 *       200:
 *         description: Statistics of artifact types and main stats for the specified set
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