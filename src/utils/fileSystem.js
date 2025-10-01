const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

class FileSystemUtil {
    /**
     * Read JSON file asynchronously
     * @param {string} filePath - Path to JSON file
     * @returns {Promise<Object>} Parsed JSON data
     */
    static async readJsonFile(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            const fileContent = await fs.readFile(absolutePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            logger.error(`Failed to read JSON file: ${filePath}`, error);
            throw new Error(`File read error: ${error.message}`);
        }
    }

    /**
     * Write JSON file asynchronously
     * @param {string} filePath - Path to write JSON file
     * @param {Object} data - Data to write
     * @param {boolean} prettify - Whether to format JSON nicely
     */
    static async writeJsonFile(filePath, data, prettify = true) {
        try {
            const absolutePath = path.resolve(filePath);
            const jsonData = prettify
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data);

            await fs.writeFile(absolutePath, jsonData, 'utf-8');
            logger.info(`Successfully wrote JSON file: ${filePath}`);
        } catch (error) {
            logger.error(`Failed to write JSON file: ${filePath}`, error);
            throw new Error(`File write error: ${error.message}`);
        }
    }

    /**
     * Check if file exists
     * @param {string} filePath - Path to check
     * @returns {Promise<boolean>} True if file exists
     */
    static async fileExists(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            await fs.access(absolutePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Create directory if it doesn't exist
     * @param {string} dirPath - Directory path to create
     */
    static async ensureDirectory(dirPath) {
        try {
            const absolutePath = path.resolve(dirPath);
            await fs.mkdir(absolutePath, { recursive: true });
        } catch (error) {
            logger.error(`Failed to create directory: ${dirPath}`, error);
            throw new Error(`Directory creation error: ${error.message}`);
        }
    }

    /**
     * List files in directory with optional filter
     * @param {string} dirPath - Directory to list
     * @param {string} extension - Optional file extension filter
     * @returns {Promise<Array>} Array of file names
     */
    static async listFiles(dirPath, extension = null) {
        try {
            const absolutePath = path.resolve(dirPath);
            const files = await fs.readdir(absolutePath);

            if (extension) {
                return files.filter(file => path.extname(file) === extension);
            }

            return files;
        } catch (error) {
            logger.error(`Failed to list files in directory: ${dirPath}`, error);
            throw new Error(`Directory listing error: ${error.message}`);
        }
    }

    /**
     * Get file stats (size, modification date, etc.)
     * @param {string} filePath - Path to file
     * @returns {Promise<Object>} File statistics
     */
    static async getFileStats(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            const stats = await fs.stat(absolutePath);

            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory()
            };
        } catch (error) {
            logger.error(`Failed to get file stats: ${filePath}`, error);
            throw new Error(`File stats error: ${error.message}`);
        }
    }

    /**
     * Copy file from source to destination
     * @param {string} source - Source file path
     * @param {string} destination - Destination file path
     */
    static async copyFile(source, destination) {
        try {
            const sourcePath = path.resolve(source);
            const destPath = path.resolve(destination);

            // Ensure destination directory exists
            await this.ensureDirectory(path.dirname(destPath));

            await fs.copyFile(sourcePath, destPath);
            logger.info(`File copied from ${source} to ${destination}`);
        } catch (error) {
            logger.error(`Failed to copy file from ${source} to ${destination}`, error);
            throw new Error(`File copy error: ${error.message}`);
        }
    }

    /**
     * Delete file
     * @param {string} filePath - Path to file to delete
     */
    static async deleteFile(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            await fs.unlink(absolutePath);
            logger.info(`File deleted: ${filePath}`);
        } catch (error) {
            logger.error(`Failed to delete file: ${filePath}`, error);
            throw new Error(`File deletion error: ${error.message}`);
        }
    }
}

module.exports = FileSystemUtil;