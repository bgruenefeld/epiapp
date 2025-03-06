import * as fs from 'fs';
import path from 'path';
import https from "https";

import * as cheerio from "cheerio";

import { IScoreRepo, ScoreRepoJSON } from './scoreRepo';
import { PedigreeCalculator } from '../services/coiCalculator';
export interface Avk{
  avk: number; 
  lostAncestors: { name: string, count: number }[]
}
export interface Dog{
    name:string,
    link:string,
    coi?:number,
    avk?:Avk
}

export interface PedigreeResult{
  pedigree:string,
  dog:Dog
}

export class EpiDogATService {
      private scoreRepo:IScoreRepo = ScoreRepoJSON.getInstance()
      private URL = "https://www.k9data.com"
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
                // if (!url || !url.includes("k9data")) {
                //   console.error(`Ungültiges Format in Zeile: ${line2}`);
                // }
                return {name:dogName, link:url}
        });
        return epiDogs
      }

      public async getAT(k9DogID: string, verticalPedigree?: boolean): Promise<PedigreeResult | null> {
        console.log("getAt() called for id:", k9DogID)
        try {
          const agent = new https.Agent({ rejectUnauthorized: false });
          const url = verticalPedigree
            ? `${this.URL}/verticalpedigree.asp?ID=${k9DogID}`
            : `${this.URL}/fivegen.asp?ID=${k9DogID}`;
    
          return new Promise((resolve, reject) => {
            https.get(url, { agent }, (res) => {
              let data = "";
    
              res.on("data", (chunk) => {
                data += chunk; // HTML-Daten sammeln
              });
    
              res.on("end", () => {
                debugger
                const dogInfo = this.extractDogInfo(data, url);
                if (!dogInfo) {
                  reject(new Error("Fehler beim Extrahieren der Hundedaten"));
                  return;
                }
                resolve({ pedigree: data, dog: dogInfo });
              });
    
              res.on("error", (err) => reject(err));
            }).on("error", (err) => reject(err));
          });
        } catch (error) {
          console.error("Fehler beim Abrufen der Daten von k9data.com:", error);
          return null;
        }
      }

      public async getATWithEpiScores(html:PedigreeResult):Promise<PedigreeResult|undefined>{
        if(this.scoreRepo === undefined){
          return undefined;
        }
        let result ="";

        const data = cheerio.load(html.pedigree);
        const mainDog = "#result > font";
        console.log("getATWithEpiScores getAllScoredDogs", mainDog)
        this.scoreRepo.getAllScoredDogs().forEach(dog => {
          const selector = "a:contains("+dog+ ")";
          const score = this.scoreRepo.getScoreByDogName(dog)?.score
          const hasDirectProgeny = this.scoreRepo.hasDirectEpiProgeny(dog)
            data(selector).each((index2, element) => {
                  const link = data(element);

                  
                  
                  if(link.text().trim().toLowerCase().includes(dog.toLowerCase())){
                    console.log("hunde link", link.text());
                    link.addClass("ancestor")
                    link.attr("data-ancestor",link.text().trim())
                    //console.log("hunde link", link.css() );
                    
                    const hrefValue = this.getK9DataId(link.attr('href') as string);
                    if(hrefValue !== undefined){
                      link.attr('onclick', "epiat("+hrefValue+")");
                      link.attr('href', "#");
                    }

                    const value = score
                    let lightness;

                    if(value !== undefined){
                      lightness = this.mapValueToColor(value);                                          
                    }                    
                    
                    
                    const p = hasDirectProgeny?"<div style='width: 14px; height: 14px; background-color: #7e57c2; border-radius: 50%; margin-right: 6px; display: inline-block;'></div>":""
                    const scoreHtml = `<a id="${index2}" style="color:${lightness?.textColor} !important; cursor:pointer; background-color: ${lightness?.bgColor};"> (${score}) ${p}</a>`;

                    //const scoreHtml = "<a id="+index2+" style='color:"+lightness?.textColor+ "!important ;cursor:pointer;font-size:bold;background-color: "+lightness?.bgColor+"'> ("+score+")<div style='width: 14px, height: 14px, backgroundColor: #e53935,borderRadius: 50%, marginRight: 6px'></div></a>"
                    const alink = cheerio.load(scoreHtml)
                    const id = "#"+index2
                    const mylink = alink(id);
                    mylink.attr('onclick', "showDetails(this)");
                    
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
        const calculator = new PedigreeCalculator();
        const pedigree : Dog[][] = calculator.extractData(html.pedigree)
        const coi = calculator.calculateWrightCOI(pedigree); //calculator.calculateCOI(pedigree);
        const avk = calculator.calculateAVKWithLostAncestors(pedigree);
        return {pedigree:result, dog:{name:"", link:"", avk:avk, coi:coi}}

      }
      private extractDogInfo(html: string, url: string): Dog | null {
       
    
        return {
          name: "hasso",
          link: url,          
        };
       }

       private mapValueToColor(value: number, minVal: number = 0.0, maxVal: number = 1): { bgColor: string; textColor: string } {
        const lightMin = 20; // Dunkelste Lightness
        const lightMax = 90; // Hellste Lightness
    
        // Skalierung des Wertes auf den Bereich 1-10
        let mappedValue = 1 + ((value - minVal) / (maxVal - minVal)) * 9;
        mappedValue = Math.max(1, Math.min(10, Math.round(mappedValue))); // Begrenzung auf 1-10
    
        // Berechnung der Lightness
        const normalized = (mappedValue - 1) / (10 - 1);
        const inverted = 1 - value;
        const lightness = inverted * (lightMax - lightMin) + lightMin;
        mappedValue = value;
        // Farbzuweisung nach Stufen
        let hue: number;
        let textColor: string;
        if (mappedValue >= 0 && mappedValue <= 0.3) {
            hue = 30; // Orange
            textColor = "black"; // Für helles Orange bessere Lesbarkeit
        } else if (mappedValue > 0.3 && mappedValue <= 0.7) {
            hue = 0; // Rot
            textColor = "white"; // Für Rot bessere Lesbarkeit
        } else if (mappedValue > 0.7 && mappedValue <= 1) {
            hue = 280; // Violett
            textColor = "white"; // Für dunkles Violett bessere Lesbarkeit
        } else {
            hue = 0; // Standardfallback (Rot)
            textColor = "white";
        }
    
        return {
            bgColor: `hsl(${hue}, 100%, ${lightness}%)`,
            textColor: textColor
        };
    }
    
    
    //   private mapValueToColor(value: number, minVal: number = 0.0, maxVal: number = 1): { bgColor: string; textColor: string } {
    //     const lightMin = 20; // Dunkelste Lightness
    //     const lightMax = 90; // Hellste Lightness
    
    //     // Skalierung des Wertes auf den Bereich 1-10
    //     let mappedValue = 1 + ((value - minVal) / (maxVal - minVal)) * 9;
    //     mappedValue = Math.max(1, Math.min(10, Math.round(mappedValue))); // Begrenzung auf 1-10
    
    //     // Berechnung der Lightness
    //     const normalized = (mappedValue - 1) / (10 - 1);
    //     const inverted = 1 - value;
    //     const lightness = inverted * (lightMax - lightMin) + lightMin;
    //     mappedValue = value;
    //     // Farbzuweisung nach Stufen
    //     let hue: number;
    //     let textColor: string;
    //     if (mappedValue >= 0 && mappedValue <= 0.3) {
    //         hue = 30; // Orange
    //         textColor = "black"; // Für helles Orange bessere Lesbarkeit
    //     } else if (mappedValue > 0.3 && mappedValue <= 0.7) {
    //         hue = 0; // Rot
    //         textColor = "white"; // Für Rot bessere Lesbarkeit
    //     } else if (mappedValue > 0.7 && mappedValue <= 1) {
    //         hue = 280; // Violett
    //         textColor = "white"; // Für dunkles Violett bessere Lesbarkeit
    //     } else {
    //         hue = 0; // Standardfallback (Rot)
    //         textColor = "white";
    //     }
    
    //     return {
    //         bgColor: `hsl(${hue}, 100%, ${lightness}%)`,
    //         textColor: textColor
    //     };
    // }

      private getK9DataId(link:string):string|undefined {
        if(link.includes("k9data.com")){
          return link.split("=")[1];
        }
        return undefined
      }
}