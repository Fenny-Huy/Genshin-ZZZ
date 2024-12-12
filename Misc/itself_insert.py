import csv

# Define the input file and table name
input_file = "C:/Users/PV/Downloads/Artifact_itself.txt"
table_name = "`Artifact itself`"  # Replace with your MySQL table name

# Escape single quotes for SQL
def escape_single_quotes(value):
    return value.replace("'", "''")


# Generate MySQL INSERT statements
def generate_insert_statements(file_path, table):
    insert_statements = []
    with open(file_path, mode="r") as file:
        reader = csv.reader(file)
        for row in reader:
            # Format the values for the SQL query
            escaped_row = row
            formatted_values = ", ".join(f'"{field}"' for field in escaped_row)
            insert_statement = f"INSERT INTO {table} VALUES ({formatted_values});"
            insert_statements.append(insert_statement)
    return insert_statements

# Main function to execute the script
def main():
    try:
        queries = generate_insert_statements(input_file, table_name)
        output_file = "insert_statements.sql"
        
        # Write the generated queries to a file
        with open(output_file, mode="w") as file:
            file.write("\n".join(queries))
        
        print(f"Generated {len(queries)} INSERT statements.")
        print(f"Queries saved to {output_file}")
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()