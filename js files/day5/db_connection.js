import  mysql from "mysql2/promise";

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'day_5_nodejs'
});

export default db;
