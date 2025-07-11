// src/locationiqService.js
import axios from 'axios';

const API_KEY = 'pk.a14e0e5be29c6e18461a6de200c96577';

export const getSuggestions = async (query) => {
  if (!query) return [];

  try {
    const res = await axios.get('https://api.locationiq.com/v1/autocomplete', {
      params: {
        key: API_KEY,
        q: query,
        limit: 5,
        normalizecity: 1,
        countrycodes: 'in', // optional: restrict to India
        dedupe: 1
      }
    });

    return res.data.map(place => place.display_name);
  } catch (error) {
    console.error('LocationIQ autocomplete error:', error);
    return [];
  }
};
