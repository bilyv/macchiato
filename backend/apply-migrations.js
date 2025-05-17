// Simple script to run the TypeScript migration script
import { exec } from 'child_process';

console.log('Running database migrations...');

// Execute the TypeScript migration script
exec('npx tsx src/scripts/apply-migrations.ts', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  
  console.log(stdout);
});
