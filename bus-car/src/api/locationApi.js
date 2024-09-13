// locationApi.js

export const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/locations');
      if (!response.ok) {
        throw new Error('Error fetching locations');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  };
  