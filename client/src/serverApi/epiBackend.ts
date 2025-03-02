import { PedigreeResult } from "../models/models";
import API_URL from "./apiUrl";
import { ScoreRepo } from "./scoreRepo";


 export class EpiDogATService {
    
    private serverURL = API_URL;
    private scoreRepo = ScoreRepo.getInstance();

    public async fetchData(): Promise<Response|undefined> {
        try {
            return await fetch(this.serverURL+"/api/data"); // Dank Proxy braucht man keine localhost:5000 URL
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }
    public async fetchAT(id:string):Promise<PedigreeResult|undefined>{
        //let data:PedigreeResult = "";
        try {
            // const id = link.split("=")[1]
            const response = await fetch(this.serverURL+"/api/at/"+id); // Dank Proxy braucht man keine localhost:5000 URL 
            if (response === undefined || !response.ok) {
                throw new Error("Fehler beim Laden der Hundedetails");
              }
            const data = await response.json() as PedigreeResult;
            console.debug("response data", data )

            return {pedigree:data.pedigree, dog:data.dog}
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }

    public fetchEpiProgeny(dogName: string): string[] {
        const offspring = this.scoreRepo.getScoreByDogName(dogName);
        
        if(offspring !== undefined){
            return offspring.EpiProgeny
        }
        return []
        
    }
    
}
  
  