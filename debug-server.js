// Debug wrapper to catch startup errors
try {
    console.log("=== Starting server with debug wrapper ===");
    require('./src/server.js');
} catch (error) {
    console.error("=== STARTUP ERROR CAUGHT ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
}
