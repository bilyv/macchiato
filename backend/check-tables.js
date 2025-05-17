// Script to check if required tables exist in the database
import pg from 'pg';
const { Pool } = pg;

// Create a connection pool with explicit credentials
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'hotel',
  password: '7878',
  port: 5432,
});

// Query to check if tables exist
const query = `
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
  ORDER BY table_name;
`;

// Execute the query
pool.query(query, (err, res) => {
  if (err) {
    console.error('Error executing query:', err);
  } else {
    console.log('Tables in the database:');
    if (res.rows.length === 0) {
      console.log('No tables found. You need to create the required tables.');
    } else {
      res.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
  }
  
  // Close the pool
  pool.end();
});
