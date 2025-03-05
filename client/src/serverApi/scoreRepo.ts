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
    private scoreFileName = "data/scores.json";
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

    private async readScoreFile(filename: string): Promise<Map<string, DogScore>> {
        const response = await fetch("./" + filename);
        const jsonData = await response.json();
        const dogMap = new Map<string, DogScore>();

        jsonData.forEach((record: DogScore) => {
            const name = record.name.trim();
            // const score = record.score;
            // const epiProgeny = [...(record.epiProgeny.GP || []), ...(record.epiProgeny.P || [])];

            dogMap.set(name, record);
        });

        console.log("dogMap successfully created from JSON:", dogMap.size);
        return dogMap;
    }

    
}
