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

statisticsRouter.get("/substats", async (req, res) => {
  try {
    const query = `
      SELECT "Type", "Main_Stat", COUNT("Type") AS "TypeCount", 
             SUM("Percent_ATK") AS "Percent_ATK", SUM("Percent_HP") AS "Percent_HP", SUM("Percent_DEF") AS "Percent_DEF", 
             SUM("ATK") AS "ATK", SUM("HP") AS "HP", SUM("DEF") AS "DEF", 
             SUM("ER") AS "ER", SUM("EM") AS "EM", SUM("Crit_Rate") AS "Crit_Rate", 
             SUM("Crit_DMG") AS "Crit_DMG", 
             SUM("Percent_ATK"+"Percent_HP"+"Percent_DEF"+"ATK"+"HP"+"DEF"+"ER"+"EM"+"Crit_Rate"+"Crit_DMG") AS "SubstatCount"
      FROM "Artifact_itself"
      GROUP BY "Type", "Main_Stat";
    `;

    const rows = await sql.unsafe(query);
    const artifactsWithSubs = rows.map(row => ({
      type: row.Type,
      main_stat: row.Main_Stat,
      ArtifactCount: parseInt(row.TypeCount, 10),
      sub_ATK_per: parseFloat(row.Percent_ATK),
      sub_HP_per: parseFloat(row.Percent_HP),
      sub_DEF_per: parseFloat(row.Percent_DEF),
      sub_ATK: parseInt(row.ATK, 10),
      sub_HP: parseInt(row.HP, 10),
      sub_DEF: parseInt(row.DEF, 10),
      sub_ER: parseInt(row.ER, 10),
      sub_EM: parseInt(row.EM, 10),
      sub_Crit_Rate: parseFloat(row.Crit_Rate),
      sub_Crit_DMG: parseFloat(row.Crit_DMG),
      substatCount: parseInt(row.SubstatCount, 10),
    }));

    res.status(200).json(artifactsWithSubs);
  } catch (error) {
    console.error("Error fetching substats statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = statisticsRouter;