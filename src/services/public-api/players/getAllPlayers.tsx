import { BASE_URL } from "@/consts/CsGoAPI";


export const getPlayers = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  try {
    if (!BASE_URL || !API_KEY) {
      throw new Error('Missing BASE_URL or API_KEY environment variables');
    }

    const response = await fetch(`${BASE_URL}/Players?key=${API_KEY}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching players:', error);
    return null;
  }
};
