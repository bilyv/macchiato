// Script to remove the home/content record from the page_contents table
import { query } from './backend/src/config/database.js';

async function removeHomeContent() {
  try {
    console.log('Removing home/content record from page_contents table...');
    
    const result = await query(
      'DELETE FROM page_contents WHERE page_name = $1 AND section_name = $2 RETURNING *',
      ['home', 'content']
    );
    
    if (result.rowCount > 0) {
      console.log('Successfully removed home/content record:', result.rows[0]);
    } else {
      console.log('No home/content record found to remove.');
    }
  } catch (error) {
    console.error('Error removing home/content record:', error);
  } finally {
    process.exit(0);
  }
}

removeHomeContent();
