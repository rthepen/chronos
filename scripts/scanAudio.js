import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '../public/audio');
const OUTPUT_FILE = path.join(__dirname, '../src/data/audioManifest.json');

// Ensure output dir exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const manifest = {
    coaches: {},
    sfx: {}
};

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => {
        return fs.statSync(path.join(dir, file)).isFile() && !file.startsWith('.');
    });
}

// Scan Coaches
const coachesDir = path.join(AUDIO_DIR, 'coaches');
if (fs.existsSync(coachesDir)) {
    const coaches = fs.readdirSync(coachesDir).filter(f => fs.statSync(path.join(coachesDir, f)).isDirectory());

    coaches.forEach(coach => {
        manifest.coaches[coach] = {
            work: getFiles(path.join(coachesDir, coach, 'work')),
            rest: getFiles(path.join(coachesDir, coach, 'rest'))
        };
    });
}

// Scan SFX
const sfxDir = path.join(AUDIO_DIR, 'sfx');
if (fs.existsSync(sfxDir)) {
    const categories = fs.readdirSync(sfxDir).filter(f => fs.statSync(path.join(sfxDir, f)).isDirectory());
    categories.forEach(category => {
        manifest.sfx[category] = getFiles(path.join(sfxDir, category));
    });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`Audio manifest generated at ${OUTPUT_FILE}`);
