/**
 *
 * @author Ali Ahmad <https://github.com/mian-ali>
 */

const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');


const DB_NAME = '<DB_NAME';
const ARCHIVE_PATH = path.join(__dirname, 'backup', `${DB_NAME}.gzip`);
const MONGO_URI = "<Atlas Cluster URI>"; // Replace with your actual connection string

// Scheduling the backup every day at midnight
cron.schedule('0 0 * * *', () => backupMongoDB());

function backupMongoDB() {
  const child = spawn('mongodump', [
    `--uri=${MONGO_URI}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data.toString());
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', data.toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else console.log('Backup is successful 🎉');
  });
}
