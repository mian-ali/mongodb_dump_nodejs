# MongoDB Backup Script with Node.js

This project provides a Node.js script to backup your MongoDB database to a `.gzip` file daily using `node-cron`.

## Prerequisites

- Node.js and npm installed on your machine.
- MongoDB Database Tools installed. [MongoDB Database Tools download page](https://www.mongodb.com/try/download/database-tools) (specifically `mongodump` and `mongorestore`).
- A MongoDB Atlas cluster or any MongoDB instance.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mian-ali/mongodb_dump_nodejs.git
    cd mongodb_dump_nodejs
    ```

2. **Install the required packages:**

    ```bash
    npm install
    ```

## Configuration

1. **Update `backup.js` with your MongoDB details:**

    ```javascript
    const { spawn } = require('child_process');
    const path = require('path');
    const cron = require('node-cron');

    const DB_NAME = '<DB_NAME>'; // Replace with your database name
    const ARCHIVE_PATH = path.join(__dirname, 'backup', `${DB_NAME}.gzip`);
    const MONGO_URI = '<Atlas Cluster URI>'; // Replace with your MongoDB connection string

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
    ```

## Running the Backup Script

1. **Start the script using `nodemon`:**

    ```bash
    npm run dev
    ```

    This will start the `backup.js` script and schedule a backup of your MongoDB database daily at midnight.

## Restoring the Backup

To restore the MongoDB backup from the `.gzip` file, use the following steps:

1. **Ensure MongoDB tools are installed:**

    Make sure you have `mongorestore` available on your machine.

2. **Run the `mongorestore` command:**

    ```bash
    mongorestore --gzip --archive=path/to/your/backup/chat-app.gzip --nsFrom="chat-app.*" --nsTo="new-chat-app.*" --uri="mongodb+srv://<cred>@<your connection string>/chat-app"
    ```

    Replace `path/to/your/backup/chat-app.gzip` with the actual path to your backup file, and `new-chat-app` with the database name where you want to restore the data.

## Project Structure

```plaintext
mongodb_dump_nodejs/
|── backup
├── backup.js
├── package.json
└── README.md
