export interface Dog{
    name:string,
    link:string,
    coi?:number,
    avg?:number
}
export interface PedigreeResult{
    pedigree:string,
    dog:Dog
}