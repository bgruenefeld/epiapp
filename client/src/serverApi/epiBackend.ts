

 export class EpiDogATService {
    
    private serverURL = "http://localhost:10000";

    public async fetchData(): Promise<Response|undefined> {
        try {
            return await fetch(this.serverURL+"/api/data"); // Dank Proxy braucht man keine localhost:5000 URL
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }
    public async fetchAT(id:string):Promise<Response|undefined>{
        try {
            // const id = link.split("=")[1]
            const res = await fetch(this.serverURL+"/api/at/"+id); // Dank Proxy braucht man keine localhost:5000 URL 
            console.log("fetchAT response", res)
            return res
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    }
}
  
  