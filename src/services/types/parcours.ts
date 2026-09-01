// Pour les niveaux
export enum NiveauEnum {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  M1 = "M1",
  M2 = "M2",
  D1 = "D1",
  D2 = "D2",
}

// Pour les formations
export enum FormationEnum {
  Academique = "Academique",
  Professionnalisante = "Professionnalisante",
}

export interface Parcours {
  id_parcours?: number;            
  id_mention: number;            
  nom_parcours: string;          
  niveau_parcours?: NiveauEnum;   
  formation_type: FormationEnum;  
  description_parcours?: string;  
}
