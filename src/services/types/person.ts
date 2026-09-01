export type BasePerson = {
    type: string;
    id : number;
    nom             : string ; 
	email           : string ;   
	tel             : string ;   
	prenom          : string ;    
	dateInsertion  : string ;    
	sexe            : "F"|"M" ;   
}

export type PAT = BasePerson & {
    type : "pat";
    postAffectation:string;
    grade : string;
    fonction : string ;
}

export type Professeur = BasePerson & {
    type:"professeur";
    titre:string;
}

export type COFAC = BasePerson & {
    type:"cofac";
    appartenance:string;
}

export type doyenEtVice = BasePerson & {
    type : "doyen_et_vice";
    responsabilite:string;
}

export type BasePersonWithoutId = Omit<BasePerson, "id">;

export type PersonType = "pat" | "professeur" | "cofac" | "doyen_et_vice";

export type Person = PAT | Professeur | COFAC | doyenEtVice
