
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
          // CSV-Datei einlesen
          // Erstellen einer Map: Key = Hundename, Value = { Score, EpiProgeny }
        //   const filePath = new URL(filename, import.meta.url).href;
        //     console.log("Dateipfad:", filePath);
            const response = await fetch("./"+filename); // Stelle sicher, dass die Datei im `public/`-Ordner liegt
            const csvData = await response.text();
        //const filePath = path.join(__dirname, ".", filename);
        const dogMap = new Map<string, { Score: number; EpiProgeny: string[] }>();
        
        // fs.readFile(filePath, 'utf8', (readErr, csvData) => {
        //     if (readErr) {
        //         console.error('Fehler beim Lesen der CSV-Datei:', readErr);
        //         return;
        //     }
            // CSV parsen; header: true sorgt dafür, dass die erste Zeile als Header genutzt wird,
            // skipEmptyLines: true ignoriert leere Zeilen.
            const result = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            });
        
            
        
            // Typisieren der geparsten Daten
            const records = result.data as { [key: string]: string }[];
        
            records.forEach(record => {
            const name = record.Hundename.trim();
            const score = parseFloat(record.Score);
            const epiProgeny = record.EpiProgeny.split(",");
        
            dogMap.set(name, { Score: score, EpiProgeny: epiProgeny });
        // });
    
        // Ausgabe der Map zur Kontrolle
       
        });
        console.log("dogMap successfully created:",dogMap.size);
        return dogMap;
        };
}