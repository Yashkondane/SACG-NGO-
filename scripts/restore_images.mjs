import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const images = [
    { name: 'logo.jpg', text: 'Logo', color: '2563eb' },
    { name: 'event-stage.jpg', text: 'Event Stage', color: '16a34a' },
    { name: 'vision-mural.jpg', text: 'Vision Mural', color: '9333ea' },
    { name: 'community-group.jpg', text: 'Community Group', color: 'ea580c' },
    { name: 'hero.jpeg', text: 'Hero Image', color: 'dc2626' },
    { name: 'mission-traditional.jpg', text: 'Mission', color: '4f46e5' },
    { name: 'outdoor-gathering.jpg', text: 'Outdoor Gathering', color: '0891b2' },
    { name: 'unnamed-20-2817-29.jpg', text: 'Event Detail', color: 'be123c' },
];

const destDir = path.join(process.cwd(), 'public', 'images');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

async function downloadImage(image) {
    const url = `https://placehold.co/800x600/${image.color}/FFF.jpg?text=${encodeURIComponent(image.text)}`;
    const dest = path.join(destDir, image.name);

    console.log(`Downloading ${image.name}...`);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

        await pipeline(response.body, createWriteStream(dest));
        console.log(`Saved ${image.name}`);
    } catch (err) {
        console.error(`Error downloading ${image.name}: ${err.message}`);
    }
}

async function main() {
    await Promise.all(images.map(downloadImage));
    console.log('All downloads complete.');
}

main();
