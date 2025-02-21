import * as fs from 'fs';
import path from 'path';
import https from "https";

import * as cheerio from "cheerio";

import Papa from 'papaparse';
import { ScoreRepo } from './scoreRepo';

export interface Dog{
    name:string,
    link:string
  }

export class EpiDogATService {
      private scoreRepo:ScoreRepo = ScoreRepo.getInstance()

      public constructor(){}

      public getAllEpiDogs():Dog[]{

        let epiDogs:Dog[]=[];
        const filePath = path.join(__dirname, ".", "k9-urls.txt");
        const content = fs.readFileSync(filePath, 'utf-8');
        epiDogs = content
              .split('\n')
              .filter(line => line.trim() !== '') // Leerzeilen ignorieren
              .map(line2 => {
                const aDogLine = line2.split('\t');
                const dogName = aDogLine[0];
                const url = aDogLine[1];
                if (!url || !url.includes("k9data")) {
                  console.error(`Ungültiges Format in Zeile: ${line2}`);
                }
                return {name:dogName, link:url}
        });
        return epiDogs
      }

      public async getAT(k9DogID: string, verticalPedigree?: boolean): Promise<string | null> {
        try {
          
          //const httpsAgent = new https.Agent({ rejectUnauthorized: false });
          const agent = new https.Agent({
            rejectUnauthorized: false
          });
          
          const url = verticalPedigree
            ? `https://www.k9data.com/verticalpedigree.asp?ID=${k9DogID}`
            : `https://www.k9data.com/fivegen.asp?ID=${k9DogID}`;
      
          
          return new Promise((resolve, reject) => {
            https.get(url, { agent }, (res) => {
                let data = "";
    
                res.on("data", (chunk) => {
                    data += chunk; // Daten sammeln
                });
    
                res.on("end", () => {
                    resolve(data); // Daten an den Aufrufer weitergeben
                });
    
                res.on("error", (err) => {
                    reject(err); // Fehler weitergeben
                });
            }).on("error", (err) => {
                reject(err); // Fehler weitergeben
            });
        });
        } catch (error) {
          console.error("Fehler beim Abrufen der Daten von k9data.com:", error);
          return null;
        }
      }
      
      public getEpiProgenyByDogName(dogName: string): string[]{
        console.log("getEpiProgenyByDogName for dogname", "-" + dogName + "-");
        const epiProgeny = this.scoreRepo.getScoreByDogName(dogName)?.EpiProgeny;
        if(epiProgeny !== undefined){
          return epiProgeny
        }
        return []
      }

      public async getATWithEpiScores(html:string):Promise<string>{
        if(this.scoreRepo === undefined){
          return "";
        }
        let result ="";

        const data = cheerio.load(html);
        const mainDog = "#result > font";
        console.log("getATWithEpiScores getAllScoredDogs")
        this.scoreRepo.getAllScoredDogs().forEach(dog => {
          const selector = "a:contains("+dog+ ")";
          const score = this.scoreRepo.getScoreByDogName(dog)?.Score

            data(selector).each((index2, element) => {
                  const link = data(element);
                  
                  if(link.text().trim().toLowerCase().includes(dog.toLowerCase())){
                    const hrefValue = this.getK9DataId(link.attr('href') as string);
                    if(hrefValue !== undefined){
                      link.attr('onclick', "epiat("+hrefValue+")");
                      link.attr('href', "#");
                    }

                    const value = score
                    let lightness = "0"

                    if(value !== undefined){
                      lightness = (100 - (value / 100) * 90).toFixed(0);
                    }
                      

                    const linkHtml = "<a id="+index2+" style='cursor:pointer;font-size:bold;background-color: hsl(0, 100%, "+lightness+"%)'> ("+score+")</a>"
                    const alink = cheerio.load(linkHtml)
                    const id = "#"+index2
                    const mylink = alink(id);
                    mylink.attr('onclick', "showDetails(this)");
                    // console.log("dogname data-text", dogName)
                    mylink.attr('data-text',dog)
                    link.after(alink.html());
            }
          });

          data(mainDog).each((index3, mainDog2) =>{
            // console.log("maindog", mainDog)
            const link = data(mainDog2);
            // console.log("maindog2",mainDog2);
            const linkHtml = "<a id="+index3+" style='cursor:pointer'>"+score+"</a>"
            const alink = cheerio.load(linkHtml)
            const id = "#"+index3
            const mylink = alink(id);
            mylink.attr('onclick', "showDetails(this)");
            mylink.attr('data-text',dog)
            link.after(alink.html());

          })
        })
        
        const newData = data("table[width='100%']").eq(1);
        result = newData.html() as string;

        return result

      }
      private getK9DataId(link:string):string|undefined {
        if(link.includes("k9data.com")){
          return link.split("=")[1];
        }
        return undefined
      }
}