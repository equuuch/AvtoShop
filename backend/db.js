const { Pool } = require('pg');

// The connection string is now hardcoded for reliability.
// This removes the need for .env files and environment variable issues.
const connectionString = 'postgresql://postgres.wspngngoaxisuphzspir:AvtoShop2024%21@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};