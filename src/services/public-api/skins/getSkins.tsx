import { BASE_URL_API_MYKEL } from "@/consts/CsGoAPI";

export const getAllSkins = async () => {
    try {
      if (!BASE_URL_API_MYKEL) {
        throw new Error('Missing BASE_URL environment variable');
      }
  
      const response = await fetch(`${BASE_URL_API_MYKEL}skins.json`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching skins:', error);
      return [];
    }
  };
  