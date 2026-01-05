# convert_safe.py
import re

# === CONFIG ===
USER_ID = "e822f136-f1ac-4a79-aff0-26096f40d4bd"  # Replace with your user ID
INPUT_FILE = "genshin_data.sql"       # Your original dump
OUTPUT_FILE = "genshin_converted.sql" # New SQL output

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

converted_lines = []

for line in lines:
    # Artifact Itself
    if 'INSERT INTO public."Artifact_itself"' in line:
        line = line.replace('public."Artifact_itself"', "genshin_t3_artifact_itself")
        # Column names
        line = line.replace(
            '("ID", "Set", "Type", "Main_Stat", "Number_of_substat", "Percent_ATK", "Percent_HP", "Percent_DEF", "ATK", "HP", "DEF", "ER", "EM", "Crit_Rate", "Crit_DMG", "Where_got_it", "Score", "CreateDate")',
            '("id", "userId", "set", "type", "mainStat", "numberOfSubstat", "percentATK", "percentHP", "percentDEF", "atk", "hp", "def", "er", "em", "critRate", "critDMG", "whereGotIt", "score", "createDate")'
        )
        # Inject userId only in VALUES
        line = re.sub(r'\(\s*(\d+),', fr"(\1, '{USER_ID}',", line)
    # Artifact Leveling
    elif 'INSERT INTO public."Artifact_leveling"' in line:
        line = line.replace('public."Artifact_leveling"', "genshin_t3_artifact_leveling")
        line = line.replace(
            '("ID", "L_HP", "L_ATK", "L_DEF", "L_Percent_HP", "L_Percent_ATK", "L_Percent_DEF", "L_EM", "L_ER", "L_Crit_Rate", "L_Crit_DMG", "Added_substat", "CreateDate", "LastAdded")',
            '("id", "lHP", "lATK", "lDEF", "lPercentHP", "lPercentATK", "lPercentDEF", "lEM", "lER", "lCritRate", "lCritDMG", "addedSubstat", "createDate", "lastAdded")'
        )
    converted_lines.append(line)

# Write new SQL
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.writelines(converted_lines)

print(f"✅ Converted SQL saved to {OUTPUT_FILE}")
