import postgres from 'postgres';
import config from './config';

const sql = postgres({
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export default sql;