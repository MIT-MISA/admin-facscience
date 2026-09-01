import { baseURL } from "..";
import { mockParcours } from "../mocked-data";
import { Parcours } from "../types/parcours";

export const getAll = async () => {
  try {
    const response = await fetch(`${baseURL}/api/parcours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours[] = await response.json();
    return data;
    return mockParcours;
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}

export const getPerMention = async () => {
  try {
    const response = await fetch(`${baseURL}/api/parcours/mention`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours[] = await response.json();
    return data;
    return mockParcours;
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}

export const getByMention = async (id_:number) => {
  try {
    const response = await fetch(`${baseURL}/api/parcours/${id_}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours[] = await response.json();
    return data;
    return mockParcours;
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}

export const create = async (newParcour: Parcours) => {
  try {
    const response = await fetch(`${baseURL}/api/parcours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newParcour)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours = await response.json();
    return data;
    return newParcour;
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}

export const update = async (id_:number, updateParcours: Partial<Parcours>) => {
  try {
    const response = await fetch(`${baseURL}/api/Parcours/${id_}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateParcours)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours = await response.json();
    return data;
    return mockParcours[0];
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}

export const remove = async (id_:number) => {
  try {
    const response = await fetch(`${baseURL}/api/parcours/${id_}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data: Parcours = await response.json();
    return data;
    return mockParcours[0];
  } catch (error) {
    console.error('Erreur lors du POST :', error);
    throw error;
  }
}
