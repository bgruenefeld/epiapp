import { Avk, Dog } from "../repositories/epiDogs";

import * as cheerio from "cheerio";

export class PedigreeCalculator{
    
    public constructor(){}

    public calculateCoi(html:string):number{
        const pedigree:Dog[][] = this.extractData(html);

        return 0;
    }

    public calculateCOI(pedigree: Dog[][]): number {
        const visitedAncestors = new Map<string, number>();
    
        const calculateCOIRecursive = (dog: Dog, generation: number): number => {
          if (!dog.name) return 0;
          if (visitedAncestors.has(dog.name)) {
            return (1 / 2) ** (generation + visitedAncestors.get(dog.name)! + 1);
          }
          visitedAncestors.set(dog.name, generation);
          return 0;
        };
    
        let totalCOI = 0;
        for (let genIndex = 0; genIndex < pedigree.length; genIndex++) {
          for (const dog of pedigree[genIndex]) {
            totalCOI += calculateCOIRecursive(dog, genIndex);
          }
        }
        return totalCOI * 100; // COI in Prozent
    }    

    public calculateWrightCOI(pedigree: Dog[][]): number {
        const ancestorGenerations = new Map<string, number[]>();
        const ancestorCOI = new Map<string, number>();
        
        // Vorfahren erfassen
        for (let generation = 0; generation < pedigree.length; generation++) {
          for (const dog of pedigree[generation]) {
            if (!dog.name) continue;
            if (!ancestorGenerations.has(dog.name)) {
              ancestorGenerations.set(dog.name, []);
            }
            ancestorGenerations.get(dog.name)!.push(generation);
            if (dog.coi !== undefined) {
              ancestorCOI.set(dog.name, dog.coi / 100); // COI als Dezimalzahl speichern
            }
          }
        }
    
        let totalCOI = 0;
        for (const [name, generations] of ancestorGenerations.entries()) {
          if (generations.length >= 2) {
            // Berechne für alle Paarungen von doppelten Ahnen
            for (let i = 0; i < generations.length - 1; i++) {
              for (let j = i + 1; j < generations.length; j++) {
                const n1 = generations[i];
                const n2 = generations[j];
                const F_A = ancestorCOI.get(name) || 0; // COI des Ahnen berücksichtigen
                totalCOI += 2 * ((1 / 2) ** (n1 + n2 + 1)) * (1 + F_A); // Faktor 2 hinzugefügt
              }
            }
          }
        }
    
          
      return parseFloat((totalCOI * 100).toFixed(2)); // COI in Prozent
    }


    public calculateAVK(pedigree: Dog[][]): number {
        const totalAncestors = pedigree.flat().length;
        const uniqueAncestors = new Set(pedigree.flat().map(dog => dog.name)).size;
        const avk = parseFloat(((uniqueAncestors / totalAncestors) * 100).toFixed(2));
        return avk;
    }

    public calculateAVKWithLostAncestors(pedigree: Dog[][]): Avk {
      // Entferne "Unknown" Einträge
      const allAncestors = pedigree.flat().map(dog => dog.name).filter(name => name !== "(Unknown)");
    
      const totalAncestors = allAncestors.length;
      const uniqueAncestorsSet = new Set(allAncestors);
      const uniqueAncestorsCount = uniqueAncestorsSet.size;
    
      // Berechnung des AVK
      const avk = parseFloat(((uniqueAncestorsCount / totalAncestors) * 100).toFixed(2));
    
      // Ermittlung der mehrfach vorkommenden Ahnen und deren Häufigkeit
      const ancestorCounts = allAncestors.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
      // Liste der mehrfach vorkommenden Ahnen mit ihrer Häufigkeit, ohne "Unknown", absteigend sortiert
      const lostAncestors = Object.entries(ancestorCounts)
        .filter(([name, count]) => count > 1) // nur Ahnen mit mehr als einer Vorkommen zählen
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count); // Absteigend sortieren
    
      return { avk, lostAncestors };
    }
    
    

    public extractData(html: string): Dog[][] {

        const data = cheerio.load(html);
        const r6: Dog[] = this.extractGeneration(data, "100%");
        const r5: Dog[] = this.extractGeneration(data, "50%");
        const r4: Dog[] = this.extractGeneration(data, "33%");
        const r3: Dog[] = this.extractGeneration(data, "25%");
        const r2: Dog[] = this.extractGeneration(data, "16%");
        const r1: Dog[] = this.extractGeneration(data, "14%");
      
        return [r1, r2, r3, r4, r5, r6];
    }

    private extractGeneration(parsedHTML: any, generation: string): Dog[] {

        const $ = cheerio.load(parsedHTML);

        const dogNames = parsedHTML("td[width='" + generation + "'] > font");
        const r: Dog[] = [];
      
        dogNames.each((index: any, element: any) => {
          const aTag = $(element).find(" > a");
          let attributeValue = undefined;
          
          if (aTag && aTag.attr("href") != undefined) {
            attributeValue = aTag.attr("href");
          }
         
          const dogName = $(element).text();

          if(attributeValue !== undefined){
            r.push({ link: attributeValue, name: dogName });
          }
          
        });
      
        return r;
    }
}