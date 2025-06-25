import { pool } from "../../utils/database/db.js";

const test = async () => {
  const result = await pool.query('SELECT NOW()');
  console.log("Connected! Server time:", result.rows[0].now);
  pool.end();
};

test();
