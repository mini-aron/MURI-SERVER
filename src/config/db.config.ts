import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
  },
  pool: { min: 2, max: 10 }
});

db.raw('SELECT 1')
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch(err => {
    console.error('DB 연결 실패', err);
  });

export default db;
