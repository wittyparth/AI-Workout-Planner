const fs = require("fs").promises
const path = require("path")
const logger = require("./logger")


class FileSystemUtil {
    static async readJsonFile(filePath){
        try {
            const data = await fs.readFile(filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            logger.error(`Failed to read JSON file at ${filePath}: ${error.message}`)
            throw error
        }
    }

    static async writeJsonFile(filePath, data){
        try {
            const response = await fs.writeFile(filePath,data)
        } catch (error) {
            logger.error(`Failed to write JSON file at ${filePath}: ${error.message}`)
            throw error
        }
    }

    static async fileExists(filePath){
        try {
            const absolutePath = path.resolve(filePath)
            await fs.access(absolutePath)
            return true
        } catch (error) {
            logger.error(`Failed to find file at ${filePath}`)
            return false
        }
    }

    static async ensureDirectory(dirPath){
        try {
            
        } catch (error) {
            
        }
    }

    static async listFiles(dirPath){

    }

    static async getFilesStats(filePath){

    }

    static async copyFile(source,destination){

    }

    static async deleteFile(filePath){

    }
}

module.exports = FileSystemUtil