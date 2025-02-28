import * as fs from 'fs';
import path from 'path';

import Papa from 'papaparse';
export type Score = {
    Score:number;
    EpiProgeny: string[];
}
export class ScoreRepo{
    
    private static scoreRepository:ScoreRepo;
    private scoreFileName = "scores.csv";
    private scoreRepo:  Map<string, Score> = new Map();
   
    private constructor() {
        this.initScoreRepo();
        setInterval(this.keepAlive, 600000);
        this.keepAlive();
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
    private initScoreRepo():void {
        this.scoreRepo = this.readScoreFile(this.scoreFileName);
    }
    private async keepAlive() {
        try {
            const response = await fetch("https://epiapp-server.onrender.com");
            const result = await response.json();
            console.log("Frontend state:", result.message);
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }
    private readScoreFile(filename: string): Map<string, Score> {
          // CSV-Datei einlesen
          // Erstellen einer Map: Key = Hundename, Value = { Score, EpiProgeny }
        const filePath = path.join(__dirname, ".", filename);
        const dogMap = new Map<string, { Score: number; EpiProgeny: string[] }>();
        
        fs.readFile(filePath, 'utf8', (readErr, csvData) => {
            if (readErr) {
                console.error('Fehler beim Lesen der CSV-Datei:', readErr);
                return;
            }
            // CSV parsen; header: true sorgt dafür, dass die erste Zeile als Header genutzt wird,
            // skipEmptyLines: true ignoriert leere Zeilen.
            const result = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            });
        
            // Prüfen, ob Parsing-Fehler aufgetreten sind
            if (result.errors.length > 0) {
            console.error('Fehler beim Parsen der CSV:', result.errors);
            return;
            }
        
            // Typisieren der geparsten Daten
            const records = result.data as { [key: string]: string }[];
        
            records.forEach(record => {
            const name = record.Hundename.trim();
            const score = parseFloat(record.Score)/213;
            const epiProgeny = record.EpiProgeny.split(",");
        
            dogMap.set(name, { Score: score, EpiProgeny: epiProgeny });
        });
        // Schritt 1: Min- und Max-Wert aus der Map extrahieren
        const scores = Array.from(dogMap.values()).map(dog => dog.Score);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);

        console.log(`Min Score: ${minScore}, Max Score: ${maxScore}`);

        // Schritt 2: Min-Max-Normalisierung durchführen und speichern
        dogMap.forEach((dog, name) => {
            const normalizedScore = (maxScore !== minScore) 
                ? (dog.Score - minScore) / (maxScore - minScore) 
                : 0; // Falls alle Werte gleich sind, setze alles auf 0

            // Speichere den normalisierten Wert zurück in die Map
            dogMap.set(name, { 
                Score: parseFloat(normalizedScore.toFixed(3)), 
                EpiProgeny: dog.EpiProgeny 
            });
        });
        // Ausgabe der Map zur Kontrolle
        console.log("dogMap successfully created:",dogMap.size);
        });
        return dogMap;
        };
}