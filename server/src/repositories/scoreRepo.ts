import * as fs from 'fs';
import path from 'path';

export type Score = {
    Score: number;
    EpiProgeny: string[];
};
export interface DogScore {
    name: string;
    score: number;
    k9Url: string,
    epiProgeny:Progeny;
}
export interface Progeny{P:string[],GP:string[],GGP:string[],GGGP:string[],GGGGP:string[]}  

export interface IScoreRepo {
    getScoreByDogName(dogName: string): DogScore | undefined;
    getAllScoredDogs(): string[];
    hasDirectEpiProgeny(dogName:string):boolean;
}

export class ScoreRepoJSON implements IScoreRepo {
    private static scoreRepository: ScoreRepoJSON;
    private scoreFileName = "scores.json";
    private scoreRepo: Map<string, DogScore> = new Map();

    private constructor() {
        this.initScoreRepo();
    }

    public static getInstance(): ScoreRepoJSON {
        if (!ScoreRepoJSON.scoreRepository) {
            ScoreRepoJSON.scoreRepository = new ScoreRepoJSON();
        }
        return ScoreRepoJSON.scoreRepository;
    }

    public getScoreByDogName(dogName: string): DogScore | undefined {
        return this.scoreRepo.get(dogName);
    }

    public getAllScoredDogs(): string[] {
        return Array.from(this.scoreRepo.keys());
    }
    
    public hasDirectEpiProgeny(dogName:string):boolean {
        const dog = this.scoreRepo.get(dogName)
        if(dog === undefined){
            return false;
        }
        return dog.epiProgeny.P?.length>0
    }

    private async initScoreRepo(): Promise<void> {
        this.scoreRepo = await this.readScoreFile(this.scoreFileName);
    }

    private readScoreFile(filename: string): Map<string, DogScore> {
        const filePath = path.join(__dirname, "./", filename);
        const dogMap = new Map<string, DogScore>();

        try {
            const jsonData = fs.readFileSync(filePath, 'utf8');
            const records = JSON.parse(jsonData);

            records.forEach((record: DogScore) => {
                const name = record.name.trim();                
                dogMap.set(name, record);
            });

            console.log("dogMap successfully created from JSON:", dogMap.size);
            
            // Schritt 1: Min- und Max-Wert aus der Map extrahieren
            const scores = Array.from(dogMap.values()).map(dog => dog.score);
            const minScore = Math.min(...scores);
            const maxScore = Math.max(...scores);

            console.log(`Min Score: ${minScore}, Max Score: ${maxScore}`);

            // Schritt 2: Min-Max-Normalisierung durchführen und speichern
            dogMap.forEach((dog, name) => {
                const normalizedScore = (maxScore !== minScore) 
                    ? (dog.score - minScore) / (maxScore - minScore) 
                    : 0; // Falls alle Werte gleich sind, setze alles auf 0

                // Speichere den normalisierten Wert zurück in die Map
                dogMap.set(name, { 
                    name:name,
                    k9Url:"",
                    score: parseFloat(normalizedScore.toFixed(3)), 
                    epiProgeny: dog.epiProgeny 

                });
            });
        } catch (error) {
            console.error('Fehler beim Lesen der JSON-Datei:', error);
        }
        return dogMap;
    }
}
