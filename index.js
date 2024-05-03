const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");

// Set global variable for base directory
global.__basedir = __dirname;

// Function to read and require JavaScript files from a directory
const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    return Promise.all(
      files
        .filter((file) => path.extname(file).toLowerCase() === ".js")
        .map((file) => require(path.join(directory, file)))
    );
  } catch (error) {
    console.error("Error reading and requiring files:", error);
    throw error; // Rethrow the error for higher-level handling
  }
};

// Main function to connect and initialize
async function initialize() {
  console.log("X-Asena");

  try {
    // Read and require database files
    await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
    console.log("Syncing Database");
    // Sync database
    await config.DATABASE.sync();

    // Read and require plugin files
    console.log("⬇  Installing Plugins...");
    await readAndRequireFiles(path.join(__dirname, "/assets/plugins/"));
    console.log("✅ Plugins Installed!");

    // Connect to the main function
    await connect();
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1); // Exit with error status
  }
}

// Call the initialization function
initialize();
