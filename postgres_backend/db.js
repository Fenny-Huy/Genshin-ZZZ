const postgres = require('postgres');
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: true, // Validate the server certificate
    ca: fs.readFileSync("./prod-ca-2021.crt").toString(), // Use the provided certificate
  },
});


module.exports = sql;