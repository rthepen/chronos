import audioManifest from '../data/audioManifest.json';

interface Manifest {
    coaches: Record<string, { work: string[]; rest: string[] }>;
    sfx: Record<string, string[]>;
}

class AudioEngineService {
    private manifest: Manifest;
    private volume: number = 1.0;

    constructor() {
        this.manifest = audioManifest as Manifest;
    }

    private getRandomItem(arr: string[]): string | null {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public playCue(coach: string, category: 'work' | 'rest' | 'finish'): void {
        console.log(`[AudioEngine] Requested cue for coach: ${coach}, category: ${category}`);

        let file: string | null = null;
        let filePath = '';

        if (category === 'finish') {
            // SFX
            const files = this.manifest.sfx['finish'];
            if (files) {
                file = this.getRandomItem(files);
                if (file) {
                    filePath = `/audio/sfx/finish/${file}`;
                }
            }
        } else {
            // Coach
            // Default to 'eva' if coach unknown? Or warn?
            // Request said "Hardcode 'eva' as the default coach for now" in the Hook step. Here we just accept the argument.
            const coachData = this.manifest.coaches[coach];
            if (coachData) {
                const files = coachData[category]; // 'work' or 'rest'
                file = this.getRandomItem(files);
                if (file) {
                    filePath = `/audio/coaches/${coach}/${category}/${file}`;
                }
            } else {
                console.warn(`[AudioEngine] Coach ${coach} not found in manifest.`);
            }
        }

        if (file) {
            console.log(`[AudioEngine] Playing: ${file}`);
            this.playFile(filePath);
        } else {
            console.log(`[AudioEngine] No audio found for ${coach} - ${category} (Files empty or missing)`);
        }
    }

    private playFile(path: string) {
        const audio = new Audio(path);
        audio.volume = this.volume;
        audio.play().catch(e => console.error("Audio play failed:", e));
    }
}

export const AudioEngine = new AudioEngineService();
