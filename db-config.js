import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'stepful_coaching_scheduler',
  password: 'password',
  port: 5432,
});

export default pool
