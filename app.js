const sharp = require('sharp');

async function work(outputPath, { backgroundPath, userPhotoPath, username, businessName, logoPath }, size = 1080) {
    try {
        const mainImage = await sharp(backgroundPath)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .sharpen()
            .toBuffer();

        const userPhoto = await sharp(userPhotoPath).resize(180, 180).toBuffer();
        const logo = await sharp(logoPath).resize(120, 120).toBuffer();

        const calcTextWidth = (text, fontSize) => text.length * 0.5 * fontSize;

        const usernameX = (560 + 930) / 2 - calcTextWidth(username, 36) / 2;
        const businessX = 540 - calcTextWidth(businessName, 28) / 2;

        const svgText = `
            <svg width="${size}" height="200">
                <style>
                    .username { fill: white; font-size: 36px; font-family: Arial, sans-serif; font-weight: bold; }
                    .business { fill: white; font-size: 28px; font-family: Arial, sans-serif; }
                </style>
                <text x="${usernameX}" y="55" class="username">${username}</text>
                <text x="${businessX}" y="115" class="business">${businessName}</text>
            </svg>
        `;

        await sharp({ create: { width: size, height: size + 130, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0.9 } } })
            .composite([
                { input: mainImage, top: 0, left: 0 },
                { input: 'images\\t2.png', top: size, left: 0 },
                { input: Buffer.from(svgText), top: size, left: 0 },
                { input: userPhoto, top: size - 99, left: size - 170 },
                {input: logo, top: 20, left: size - 160}
            ])
            .toFile(outputPath);

        console.log('Image created successfully!');
    } catch (err) {
        console.error('Error creating image:', err);
    }
}

const userData = {
    username: 'નરેન્દ્ર મોદી (BJP)',
    phone: '1234567890',
    businessName: 'Prime Minister of India',
    userPhotoPath: 'images\\user-image.png',
    backgroundPath: `images\\background.jpg`,
    logoPath: 'images\\logo.png',
};

work('output.jpg', userData);
