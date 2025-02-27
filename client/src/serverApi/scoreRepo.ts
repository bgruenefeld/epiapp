
import Papa from 'papaparse';
export type Score = {
    Score:number;
    EpiProgeny: string[];
}
export class ScoreRepo{
    
    private static scoreRepository:ScoreRepo;
                            
    private scoreFileName = "data/scores.csv";
    private scoreRepo:  Map<string, Score> = new Map();
   
    private constructor() {
        this.initScoreRepo();
    }

    public static getInstance(): ScoreRepo {
        if (!ScoreRepo.scoreRepository) {
            ScoreRepo.scoreRepository = new ScoreRepo();
        }
        return ScoreRepo.scoreRepository;
    }


    public getScoreByDogName(dogName: string): Score | undefined {
        
        return this.scoreRepo.get(dogName);
    }
    

    public getAllScoredDogs(): string[]{
        return Array.from(this.scoreRepo.keys())
    } 
    private async initScoreRepo():Promise<void> {
        this.scoreRepo = await this.readScoreFile(this.scoreFileName);
    }
        
    private async readScoreFile(filename: string): Promise<Map<string, Score>> {
        
        const response = await fetch("./epiapp/"+filename); // Stelle sicher, dass die Datei im `public/`-Ordner liegt
        const csvData = await response.text();
        const dogMap = new Map<string, { Score: number; EpiProgeny: string[] }>();

        const result = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        }); 
        
        const records = result.data as { [key: string]: string }[];
        
        records.forEach(record => {
        const name = record.Hundename.trim();
        const score = parseFloat(record.Score);
        const epiProgeny = record.EpiProgeny.split(",");
        
        dogMap.set(name, { Score: score, EpiProgeny: epiProgeny });
        
        });
        console.log("dogMap successfully created:",dogMap.size);
        return dogMap;
        };
}