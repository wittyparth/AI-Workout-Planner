const AWS = require('aws-sdk');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/environment');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Check if S3 is configured
 */
const isS3Configured = !!(config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY && config.AWS_S3_BUCKET);

if (!isS3Configured) {
    logger.warn('⚠️  AWS S3 not configured. Using placeholder URLs for file uploads.');
    logger.warn('   Add AWS credentials to .env to enable real S3 uploads.');
}

/**
 * AWS S3 Configuration
 */
const s3 = isS3Configured ? new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION
}) : null;

/**
 * Multer configuration for memory storage
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = config.ALLOWED_IMAGE_TYPES;

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.MAX_FILE_SIZE
    }
});

/**
 * Upload image to S3 with optimization (or use placeholder if S3 not configured)
 */
async function uploadImageToS3(file, folder, userId) {
    try {
        // Validate file
        if (!file || !file.buffer) {
            throw new AppError('No file provided', 400);
        }

        logger.info(`Uploading file - mimetype: ${file.mimetype}, size: ${file.buffer.length}, originalname: ${file.originalname}`);

        // Process image with Sharp (resize, optimize)
        const processedImage = await sharp(file.buffer)
            .resize(1024, 1024, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85, progressive: true })
            .toBuffer();

        // Generate unique filename
        const fileExtension = file.mimetype.split('/')[1] || 'jpg';
        const fileName = `${uuidv4()}.${fileExtension}`;
        const key = `${folder}/${userId}/${fileName}`;

        // If S3 is not configured, return placeholder
        if (!isS3Configured) {
            logger.info(`S3 not configured. Using placeholder for: ${key}`);

            const placeholderUrl = folder.includes('profile')
                ? getPlaceholderImage('profile')
                : getPlaceholderImage('progress');

            return {
                url: placeholderUrl,
                key: key,
                bucket: 'placeholder',
                fileName,
                size: processedImage.length,
                isPlaceholder: true,
                message: 'S3 not configured. Using placeholder URL.'
            };
        }

        // Upload to S3
        const params = {
            Bucket: config.AWS_S3_BUCKET,
            Key: key,
            Body: processedImage,
            ContentType: file.mimetype || 'image/jpeg',
            ACL: 'public-read',
            Metadata: {
                originalName: file.originalname || 'upload',
                uploadedBy: userId ? userId.toString() : 'unknown',
                uploadedAt: new Date().toISOString()
            }
        };

        const uploadResult = await s3.upload(params).promise();

        logger.info(`File uploaded successfully to S3: ${uploadResult.Location}`);

        return {
            url: uploadResult.Location,
            key: uploadResult.Key,
            bucket: config.AWS_S3_BUCKET,
            fileName,
            size: processedImage.length,
            isPlaceholder: false
        };

    } catch (error) {
        logger.error('S3 upload error:', error);
        throw new AppError(`Failed to upload image: ${error.message}`, 500);
    }
}

/**
 * Upload profile picture
 */
async function uploadProfilePicture(file, userId) {
    return uploadImageToS3(file, 'profile-pictures', userId);
}

/**
 * Upload progress photo
 */
async function uploadProgressPhoto(file, userId, type = 'front') {
    // Process based on photo type (front, side, back)
    const folder = `progress-photos/${type}`;
    return uploadImageToS3(file, folder, userId);
}

/**
 * Delete file from S3
 */
async function deleteFileFromS3(key) {
    try {
        // Skip if S3 not configured
        if (!isS3Configured) {
            logger.info(`S3 not configured. Skipping delete for: ${key}`);
            return { success: true, isPlaceholder: true };
        }

        const params = {
            Bucket: config.AWS_S3_BUCKET,
            Key: key
        };

        await s3.deleteObject(params).promise();
        logger.info(`File deleted successfully from S3: ${key}`);

        return { success: true, isPlaceholder: false };

    } catch (error) {
        logger.error('S3 delete error:', error);
        throw new AppError(`Failed to delete file: ${error.message}`, 500);
    }
}

/**
 * Generate signed URL for private files (future use)
 */
function getSignedUrl(key, expiresIn = 3600) {
    const params = {
        Bucket: config.AWS_S3_BUCKET,
        Key: key,
        Expires: expiresIn
    };

    return s3.getSignedUrl('getObject', params);
}

/**
 * Get placeholder image URL (for demo/testing)
 */
function getPlaceholderImage(type = 'profile') {
    const placeholders = {
        profile: 'https://ui-avatars.com/api/?name=User&size=256&background=4F46E5&color=fff',
        progress: 'https://via.placeholder.com/800x600.png?text=Progress+Photo',
        exercise: 'https://via.placeholder.com/400x300.png?text=Exercise+Image'
    };

    return placeholders[type] || placeholders.profile;
}

/**
 * Multer middleware exports
 */
const uploadMiddleware = {
    single: (fieldName) => upload.single(fieldName),
    multiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
    fields: (fields) => upload.fields(fields)
};

module.exports = {
    s3,
    uploadMiddleware,
    uploadImageToS3,
    uploadProfilePicture,
    uploadProgressPhoto,
    deleteFileFromS3,
    getSignedUrl,
    getPlaceholderImage,
    isS3Configured
};
