from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from typing import List

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
