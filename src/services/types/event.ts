export interface Actualite {
  idActualite?: number;
  titre: string;
  categorie: string;
  idCategorie?: number;
  description?: string;
  contenu?: string;
  dateCreation?: Date;
  dateMiseAJour?: Date;
  dateCommencement?: Date;
  dateFin?: Date;
  lieu?: string;
  statut: string;
  isUrgent?: boolean;
  medias: Media[]; // Ceci devrait toujours être un tableau
}

export interface Media {
  idMedia?: number;
  chemin?: string;
  media?: string;
  mimetype?: string;
}

export interface Category {
    id : number;
    name : string;
}

