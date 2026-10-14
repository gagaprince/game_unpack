import { resources, JsonAsset } from 'cc';

export interface FruitSpawn {
    x: number;
    y: number;
    level: number;
}

export interface LevelData {
    level: number;
    descendInterval: number;
    descendStep: number;
    gravity: number;
    fruits: FruitSpawn[];
}

export class LevelConfig {
    private static cache: LevelData[] | null = null;

    static load(cb: (levels: LevelData[]) => void) {
        if (this.cache) {
            cb(this.cache);
            return;
        }
        resources.load('data/levels', JsonAsset, (err, asset) => {
            if (err || !asset) {
                console.error('[LevelConfig] load failed', err);
                cb([]);
                return;
            }
            const json = asset.json as any;
            this.cache = (json.levels || []) as LevelData[];
            cb(this.cache);
        });
    }

    static getLevel(level: number): LevelData | null {
        if (!this.cache) return null;
        return this.cache.find((l) => l.level === level) || null;
    }

    static get maxLevel(): number {
        return this.cache ? this.cache.length : 3;
    }
}
