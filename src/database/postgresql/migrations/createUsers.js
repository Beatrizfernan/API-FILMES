const createUsers = `
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY ,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    avatar VARCHAR NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
module.exports = createUsers;