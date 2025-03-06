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