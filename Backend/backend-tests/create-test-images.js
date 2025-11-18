/**
 * Create actual test images using Sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createTestImages() {
    try {
        // Create test-images directory
        const dir = path.join(__dirname, 'test-images');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Create a PNG image (100x100 red square)
        await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 3,
                background: { r: 255, g: 0, b: 0 }
            }
        })
            .png()
            .toFile(path.join(dir, 'test-avatar.png'));

        console.log('✅ Created test-avatar.png');

        // Create a JPEG image (150x150 blue square)
        await sharp({
            create: {
                width: 150,
                height: 150,
                channels: 3,
                background: { r: 0, g: 0, b: 255 }
            }
        })
            .jpeg()
            .toFile(path.join(dir, 'test-progress.jpg'));

        console.log('✅ Created test-progress.jpg');

        // Create a text file (for invalid file test)
        fs.writeFileSync(path.join(dir, 'test.txt'), 'This is not an image');
        console.log('✅ Created test.txt');

        // Create a large file (over 5MB)
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 0xFF);
        fs.writeFileSync(path.join(dir, 'large-file.bin'), largeBuffer);
        console.log('✅ Created large-file.bin (6MB)');

        console.log('\n📁 Test images created in ./test-images/');

    } catch (error) {
        console.error('❌ Error creating test images:', error.message);
    }
}

createTestImages();
