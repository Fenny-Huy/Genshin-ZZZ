const express = require("express");
const cors = require("cors");
const sql = require("../db.js");

const statisticsRouter = express.Router();
statisticsRouter.use(cors());
statisticsRouter.use(express.json());

statisticsRouter.get("/mainstat", async (req, res) => {
  try {
    // Query to fetch percentages of each type
    const typePercentagesQuery = `
      SELECT "Type", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself") AS percentage, COUNT(*) as count
      FROM "Artifact_itself"
      GROUP BY "Type";
    `;
    const typePercentages = await sql.unsafe(typePercentagesQuery);

    // Transform type percentages to match FastAPI output
    const formattedTypePercentages = typePercentages.map(row => [
      row.Type,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    // Query to fetch percentages of each main stat grouped by type
    const mainStatPercentagesQuery = `
      SELECT "Type", "Main_Stat", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Type" = t."Type") AS percentage, COUNT(*) as count
      FROM "Artifact_itself" t
      GROUP BY "Type", "Main_Stat";
    `;
    const mainStatPercentages = await sql.unsafe(mainStatPercentagesQuery);

    // Transform main stat percentages to match FastAPI output
    const formattedMainStatPercentages = mainStatPercentages.map(row => [
      row.Type,
      row.Main_Stat,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    res.status(200).json({
      type_percentages: formattedTypePercentages,
      main_stat_percentages: formattedMainStatPercentages,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

statisticsRouter.get("/mainstat/:setname", async (req, res) => {
  const { setname } = req.params;
  try {
    // Query to fetch percentages of each type for the specific set
    const typePercentagesQuery = `
      SELECT "Type", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Set" = $1) AS percentage, COUNT(*) as count
      FROM "Artifact_itself"
      WHERE "Set" = $1
      GROUP BY "Type";
    `;
    const typePercentages = await sql.unsafe(typePercentagesQuery, [setname]);

    // Transform type percentages to match FastAPI output
    const formattedTypePercentages = typePercentages.map(row => [
      row.Type,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    // Query to fetch percentages of each main stat grouped by type for the specific set
    const mainStatPercentagesQuery = `
      SELECT "Type", "Main_Stat", COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Artifact_itself" WHERE "Type" = t."Type" AND "Set" = $1) AS percentage, COUNT(*) as count
      FROM "Artifact_itself" t
      WHERE "Set" = $1
      GROUP BY "Type", "Main_Stat";
    `;
    const mainStatPercentages = await sql.unsafe(mainStatPercentagesQuery, [setname]);

    // Transform main stat percentages to match FastAPI output
    const formattedMainStatPercentages = mainStatPercentages.map(row => [
      row.Type,
      row.Main_Stat,
      parseFloat(row.percentage),
      parseInt(row.count, 10),
    ]);

    res.status(200).json({
      type_percentages: formattedTypePercentages,
      main_stat_percentages: formattedMainStatPercentages,
    });
  } catch (error) {
    console.error(`Error fetching statistics for set ${setname}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = statisticsRouter;