const { Pool } = require('pg');

const pool = new Pool({
  user: 'htbybbgw',
  host: 'babar.db.elephantsql.com',
  database: 'htbybbgw',
  password: '1euQW46xPWXaYL0JuiitUi5dwtUTDPAm',
  port: 5432
});

module.exports = pool;