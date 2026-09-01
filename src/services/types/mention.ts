export interface Mention {
  idMention?: number;
  nomMention: string;
  abbreviation: string;
  descriptionMention?: string;
  logoPath?: string;
  laboratoires?: any[]; // Using any[] for now as per usage in component
  mentionNiveauParcours?: any[];
  preinscriptions?: any[];
}
