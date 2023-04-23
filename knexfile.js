const path = require("path");
module.exports = {

  development: {
        client: 'pg',
        connection: {
          user: 'htbybbgw',
          host: 'babar.db.elephantsql.com',
          database: 'htbybbgw',
          password: '1euQW46xPWXaYL0JuiitUi5dwtUTDPAm',
          port: 5432
        },
        migrations: {
          directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
        },
        useNullAsDefault: true
  }
};