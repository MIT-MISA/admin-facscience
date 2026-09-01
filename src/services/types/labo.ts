export interface DescriptionItem {
  cle: string;
  valeur: string;
}

export interface Laboratory {
  idLabo?: number;
  nomLabo: string;
  mentionRattachement: string;
  responsable: string;
  description: string | DescriptionItem[]; // Accepte les deux formats
  abbreviation?: string;
  ecoleDoctoraleRattachement?: string;
}