const { Pool } = require('pg');
const createUsers = require("./createUsers");
const pool = new Pool({
  connectionString: 'postgres://htbybbgw:1euQW46xPWXaYL0JuiitUi5dwtUTDPAm@babar.db.elephantsql.com/htbybbgw',
  ssl: { rejectUnauthorized: false } // necessário se estiver utilizando SSL
});

async function postgresConnection() {
  const client = await pool.connect();

  return client;
}

async function migrationsRun () {
  const schemas = [
    createUsers
  ].join("");

  postgresConnection()
    .then(client => client.query(schemas))
    .then(() => console.log("Migrations executed successfully"))
    .catch(error => console.error(error));
}

module.exports = migrationsRun;