const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'htbybbgw',
  host: 'babar.db.elephantsql.com',
  database: 'htbybbgw',
  password: '1euQW46xPWXaYL0JuiitUi5dwtUTDPAm',
  port: 5432
});

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    try {
      const checkUserExists = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (checkUserExists.rows.length > 0) {
        throw new AppError("este email ja esta em uso.");
      }

      const hashedPassword = await hash(password, 8);

      await client.query(
        "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
        [name, email, hashedPassword]
      );

      return response.status(201).json();
    } catch (error) {
      throw new AppError(error.message);
    } finally {
      client.release();
    }
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    try {
      const checkUserExists = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );

      if (checkUserExists.rows.length === 0) {
        throw new AppError("usuário não encontrado");
      }

      const userWithUpdatedEmail = await client.query(
        "SELECT * FROM users WHERE email = $1 AND id != $2",
        [email, id]
      );

      if (userWithUpdatedEmail.rows.length > 0) {
        throw new AppError("este email ja esta em uso.");
      }

      const currentUser = checkUserExists.rows[0];

      currentUser.name = name ?? currentUser.name;
      currentUser.email = email ?? currentUser.email;

      if (password && !old_password) {
        throw new AppError(
          "Você precisa informar a senha antiga para definir a nova senha"
        );
      }

      if (password && old_password) {
        const checkOldPassword = await compare(
          old_password,
          currentUser.password
        );

        if (!checkOldPassword) {
          throw new AppError("A senha antiga não confere.");
        }

        currentUser.password = await hash(password, 8);
      }

      await client.query(
        "UPDATE users SET name = $1, email = $2, password = $3, updated_at = NOW() WHERE id = $4",
        [currentUser.name, currentUser.email, currentUser.password, id]
      );

      return response.status(200).json();
    } catch (error) {
      throw new AppError(error.message);
    } finally {
      client.release();
    }
  }
}

module.exports = UsersController;