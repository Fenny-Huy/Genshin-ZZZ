from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from typing import List, Optional
import logging




# Configure logging
logging.basicConfig(level=logging.INFO)



# Database connection settings
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "Fennik123@"
DB_NAME = "genshinartifacts"

# FastAPI app initialization
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # URL of React application
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    try:
        yield connection
    finally:
        connection.close()

# Data model for artifacts
class Artifact(BaseModel):
    id: int
    set: str
    type: str
    main_stat: str
    number_of_substats: int
    atk_percent: int
    hp_percent: int
    def_percent: int
    atk: int
    hp: int
    defense: int
    er: int
    em: int
    crit_rate: int
    crit_dmg: int
    where_got_it: str
    score: str

# API endpoint to fetch all artifacts
@app.get("/genshinartifacts/", response_model=List[Artifact])
def get_artifacts(db: pymysql.connections.Connection = Depends(get_db_connection)):
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM `Artifact itself`")
        rows = cursor.fetchall()

        # Convert rows to a list of dicts
        artifacts = [
            {
                "id": row[0],
                "set": row[1],
                "type": row[2],
                "main_stat": row[3],
                "number_of_substats": row[4],
                "atk_percent": row[5],
                "hp_percent": row[6],
                "def_percent": row[7],
                "atk": row[8],
                "hp": row[9],
                "defense": row[10],
                "er": row[11],
                "em": row[12],
                "crit_rate": row[13],
                "crit_dmg": row[14],
                "where_got_it": row[15],
                "score": row[16],
            }
            for row in rows
        ]
    return artifacts

# API endpoint to create a new artifact
@app.post("/genshinartifacts/")
def create_artifact(artifact: Artifact, db: pymysql.connections.Connection = Depends(get_db_connection)):
    # Construct the SQL query dynamically
    query = f"""
        INSERT INTO `Artifact itself` (
            `Set`, `Type`, `Main Stat`, `Number of substat`, `%ATK`, `%HP`, `%DEF`,
            `ATK`, `HP`, `DEF`, `ER`, `EM`, `Crit Rate`, `Crit DMG`, `Where got it`, `Score`
        ) VALUES (
            "{artifact.set}", '{artifact.type}', '{artifact.main_stat}', {artifact.number_of_substats},
            {artifact.atk_percent}, {artifact.hp_percent}, {artifact.def_percent},
            {artifact.atk}, {artifact.hp}, {artifact.defense}, {artifact.er}, {artifact.em},
            {artifact.crit_rate}, {artifact.crit_dmg}, '{artifact.where_got_it}', '{artifact.score}'
        )
    """

    # Execute the query
    with db.cursor() as cursor:
        cursor.execute(query)
        db.commit()
    return {"message": "Artifact created successfully"}





# API endpoint to search for artifacts
@app.get("/search_artifacts/", response_model=List[Artifact])
def search_artifacts(
    set: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    main_stat: Optional[str] = Query(None),
    number_of_substats: Optional[int] = Query(None),
    atk_percent: Optional[int] = Query(None),
    hp_percent: Optional[int] = Query(None),
    def_percent: Optional[int] = Query(None),
    atk: Optional[int] = Query(None),
    hp: Optional[int] = Query(None),
    defense: Optional[int] = Query(None),
    er: Optional[int] = Query(None),
    em: Optional[int] = Query(None),
    crit_rate: Optional[int] = Query(None),
    crit_dmg: Optional[int] = Query(None),
    where_got_it: Optional[str] = Query(None),
    score: Optional[str] = Query(None),
    db: pymysql.connections.Connection = Depends(get_db_connection)
):
    query = "SELECT * FROM `Artifact itself` WHERE 1=1"
    if set:
        query += f' AND `Set` = "{set}"'
    if type:
        query += f" AND `Type` = '{type}'"
    if main_stat:
        query += f" AND `Main Stat` = '{main_stat}'"
    if number_of_substats is not None:
        query += f" AND `Number of substat` = {number_of_substats}"
    if atk_percent is not None:
        query += f" AND `%ATK` = {atk_percent}"
    if hp_percent is not None:
        query += f" AND `%HP` = {hp_percent}"
    if def_percent is not None:
        query += f" AND `%DEF` = {def_percent}"
    if atk is not None:
        query += f" AND `ATK` = {atk}"
    if hp is not None:
        query += f" AND `HP` = {hp}"
    if defense is not None:
        query += f" AND `DEF` = {defense}"
    if er is not None:
        query += f" AND `ER` = {er}"
    if em is not None:
        query += f" AND `EM` = {em}"
    if crit_rate is not None:
        query += f" AND `Crit Rate` = {crit_rate}"
    if crit_dmg is not None:
        query += f" AND `Crit DMG` = {crit_dmg}"
    if where_got_it:
        query += f" AND `Where got it` = '{where_got_it}'"
    if score:
        query += f" AND `Score` = '{score}'"

    with db.cursor() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()

        artifacts = [
            {
                "id": row[0],
                "set": row[1],
                "type": row[2],
                "main_stat": row[3],
                "number_of_substats": row[4],
                "atk_percent": row[5],
                "hp_percent": row[6],
                "def_percent": row[7],
                "atk": row[8],
                "hp": row[9],
                "defense": row[10],
                "er": row[11],
                "em": row[12],
                "crit_rate": row[13],
                "crit_dmg": row[14],
                "where_got_it": row[15],
                "score": row[16],
            }
            for row in rows
        ]
    return artifacts






@app.put("/genshinartifacts/{artifact_id}/")
def update_artifact(artifact_id: int, artifact: Artifact, db: pymysql.connections.Connection = Depends(get_db_connection)):
    query = f"""
        UPDATE `Artifact itself` SET
            `Set` = "{artifact.set}",
            `Type` = '{artifact.type}',
            `Main Stat` = '{artifact.main_stat}',
            `Number of substat` = {artifact.number_of_substats},
            `%ATK` = {artifact.atk_percent},
            `%HP` = {artifact.hp_percent},
            `%DEF` = {artifact.def_percent},
            `ATK` = {artifact.atk},
            `HP` = {artifact.hp},
            `DEF` = {artifact.defense},
            `ER` = {artifact.er},
            `EM` = {artifact.em},
            `Crit Rate` = {artifact.crit_rate},
            `Crit DMG` = {artifact.crit_dmg},
            `Where got it` = '{artifact.where_got_it}',
            `Score` = '{artifact.score}'
        WHERE `id` = {artifact_id}
    """

    # Log the query
    logging.info(f"Executing query: {query}")



    with db.cursor() as cursor:
        cursor.execute(query)
        db.commit()
    return {"message": "Artifact updated successfully"}