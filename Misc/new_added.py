def generate_artifact_leveling_queries(
    artifact_itself_file, artifact_leveling_file, output_file
):
    """
    Generate SQL queries for the 'Artifact leveling' table with the 'Added substat' column.

    Args:
        artifact_itself_file (str): Path to the file containing 'Artifact itself' data.
        artifact_leveling_file (str): Path to the file containing 'Artifact leveling' data.
        output_file (str): Path to the file where the SQL queries will be written.
    """
    # Define substat columns for comparison
    substats = ["%ATK","%HP","%DEF","ATK","HP","DEF","ER","EM","Crit Rate","Crit DMG"]
    l_substats=["HP","ATK","DEF","%HP","%ATK","%DEF","EM","ER","Crit Rate","Crit DMG"]  
    substats_with_prefix = [f"L_{substat}" for substat in substats]  # Add the L_ prefix

    # Load data from Artifact itself
    artifact_itself_data = {}
    with open(artifact_itself_file, "r") as file:
        for line in file:
            values = line.strip().split(",")
            id_ = int(values[0])  # Extract ID
            number_of_substats = int(values[4])  # Extract 'Number of substat'
            existing_substats = {substat: int(values[i + 5]) for i, substat in enumerate(substats)}
            artifact_itself_data[id_] = {
                "number_of_substats": number_of_substats,
                "existing_substats": existing_substats,
            }

    # Process Artifact leveling data and generate SQL queries
    queries = []
    with open(artifact_leveling_file, "r") as file:
        for line in file:
            values = line.strip().split(",")
            id_ = int(values[0])  # Extract ID
            leveling_substats = {substat: int(values[i + 1]) for i, substat in enumerate(l_substats)}
            print(leveling_substats)

            # Determine the Added substat
            if id_ in artifact_itself_data:
                artifact = artifact_itself_data[id_]
                if artifact["number_of_substats"] == 4:
                    added_substat = "None"
                else:
                    # Find the substat with a roll count in leveling not present in 'Artifact itself'
                    added_substat = "None"
                    for substat, count in leveling_substats.items():
                        if count > 0 and artifact["existing_substats"].get(substat, 0) == 0:
                            added_substat = substat
                            leveling_substats[substat] -= 1  # Decrease the count for added substat
                            break

                # Create SQL query
                query = (
                    f"INSERT INTO `Artifact leveling` (`ID`, "
                    f"{', '.join(f'`{col}`' for col in substats_with_prefix)}, `Added substat`) VALUES ("
                    f"{id_}, {', '.join(str(leveling_substats[substat]) for substat in substats)}, '{added_substat}');"
                )
                queries.append(query)

    # Write queries to the output file
    with open(output_file, "w") as file:
        for query in queries:
            file.write(query + "\n")

    print(f"SQL queries have been written to '{output_file}' successfully.")
    print(artifact_itself_data[14])
    


# Example usage
artifact_itself_file = "artifact_itself.txt"  # Path to the Artifact itself data file
artifact_leveling_file = "artifact_leveling_data.txt"  # Path to the Artifact leveling data file
output_file = "output.sql"  # Path to the output SQL file
generate_artifact_leveling_queries(artifact_itself_file, artifact_leveling_file, output_file)
