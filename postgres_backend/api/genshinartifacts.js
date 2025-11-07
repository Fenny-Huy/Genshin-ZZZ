const express = require("express");
const cors = require("cors");
const sql = require("../db.js");

const genshinArtifactsRouter = express.Router();
genshinArtifactsRouter.use(cors());
genshinArtifactsRouter.use(express.json());

genshinArtifactsRouter.get("/", async (req, res) => {
  try {
    const artifacts = await sql`SELECT * FROM "Artifact_itself"`;

    const formattedArtifacts = artifacts.map(row => ({
      id: row.ID,
      set: row.Set,
      type: row.Type,
      main_stat: row.Main_Stat,
      number_of_substats: row.Number_of_substat,
      atk_percent: row.Percent_ATK,
      hp_percent: row.Percent_HP,
      def_percent: row.Percent_DEF,
      atk: row.ATK,
      hp: row.HP,
      defense: row.DEF,
      er: row.ER,
      em: row.EM,
      crit_rate: row.Crit_Rate,
      crit_dmg: row.Crit_DMG,
      where_got_it: row.Where_got_it,
      score: row.Score,
    }));

    res.status(200).json(formattedArtifacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

genshinArtifactsRouter.post("/", async (req, res) => {
  try {
    const {
      set,
      type,
      main_stat,
      number_of_substats,
      atk_percent,
      hp_percent,
      def_percent,
      atk,
      hp,
      defense,
      er,
      em,
      crit_rate,
      crit_dmg,
      where_got_it,
      score
    } = req.body;

    const newArtifact = await sql`
      INSERT INTO "Artifact_itself" (
        "Set", "Type", "Main_Stat", "Number_of_substat", "Percent_ATK",
        "Percent_HP", "Percent_DEF", "ATK", "HP", "DEF", "ER", "EM",
        "Crit_Rate", "Crit_DMG", "Where_got_it", "Score"
      ) VALUES (
        ${set}, ${type}, ${main_stat}, ${number_of_substats}, ${atk_percent},
        ${hp_percent}, ${def_percent}, ${atk}, ${hp}, ${defense}, ${er}, ${em},
        ${crit_rate}, ${crit_dmg}, ${where_got_it}, ${score}
      ) RETURNING *;
    `;

    res.status(201).json(newArtifact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

genshinArtifactsRouter.put("/:artifact_id", async (req, res) => {
  try {
    const { artifact_id } = req.params;
    const {
      set,
      type,
      main_stat,
      number_of_substats,
      atk_percent,
      hp_percent,
      def_percent,
      atk,
      hp,
      defense,
      er,
      em,
      crit_rate,
      crit_dmg,
      where_got_it,
      score
    } = req.body;

    const updatedArtifact = await sql`
      UPDATE "Artifact_itself" SET
        "Set" = ${set},
        "Type" = ${type},
        "Main_Stat" = ${main_stat},
        "Number_of_substat" = ${number_of_substats},
        "Percent_ATK" = ${atk_percent},
        "Percent_HP" = ${hp_percent},
        "Percent_DEF" = ${def_percent},
        "ATK" = ${atk},
        "HP" = ${hp},
        "DEF" = ${defense},
        "ER" = ${er},
        "EM" = ${em},
        "Crit_Rate" = ${crit_rate},
        "Crit_DMG" = ${crit_dmg},
        "Where_got_it" = ${where_got_it},
        "Score" = ${score}
      WHERE "ID" = ${artifact_id}
      RETURNING *;
    `;

    if (updatedArtifact.length === 0) {
      return res.status(404).json({ error: "Artifact not found" });
    }

    res.status(200).json(updatedArtifact[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = genshinArtifactsRouter;