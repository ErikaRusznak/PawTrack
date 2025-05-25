export const fetchNearbyVets = async (lat: number, lng: number) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const radius = 10000;
    const type = 'veterinary_care';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.results;
};


export const geocodeCounty = async (county: string) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(county)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
    } else {
        throw new Error('Geocoding failed');
    }
};