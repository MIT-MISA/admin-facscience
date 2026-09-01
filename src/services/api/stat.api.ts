import { baseURL } from "..";

export interface StatResponse {
  title: string;
  value: number;
  change?: string;
}

export async function getStatistics(): Promise<StatResponse[]> {
  try {
    // Récupérer les comptes de chaque entité
    const [mentions, parcours, actualites, laboratoires, personnes] = await Promise.all([
      fetch(`${baseURL}/api/Mention`).then(res => res.json()),
      fetch(`${baseURL}/api/Parcours`).then(res => res.json()),
      fetch(`${baseURL}/api/Actualite`).then(res => res.json()),
      fetch(`${baseURL}/api/Laboratoire`).then(res => res.json()),
      fetch(`${baseURL}/api/Personne`).then(res => res.json())
    ]);

    return [
      {
        title: "Mentions",
        value: mentions.length,
        change: "+2%"
      },
      {
        title: "Parcours", 
        value: parcours.length,
        change: "+5%"
      },
      {
        title: "Actualités",
        value: actualites.length,
        change: "+12%"
      },
      {
        title: "Laboratoires",
        value: laboratoires.length,
        change: "+3%"
      },
      {
        title: "Personnes",
        value: personnes.length,
        change: "+8%"
      }
    ];
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw new Error('Impossible de récupérer les statistiques');
  }
}