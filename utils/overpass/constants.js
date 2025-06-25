export const OVERPASS_CITY_NAME = 'București';
export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const ALL_ROADS_QUERY = (cityName = OVERPASS_CITY_NAME) => `
[out:json][timeout:60];
area["name"="${cityName}"]->.bucuresti;
(
  way["highway"~"primary|secondary|tertiary"](area.bucuresti);
);
out geom;
`;

export const ALL_TRANSPORT_QUERY = (cityName = OVERPASS_CITY_NAME) => `
[out:json][timeout:60];
area["name"="${cityName}"]->.bucuresti;
(
  // bus and trolleybus
  node["highway"="bus_stop"](area.bucuresti);

  // tram
  node["public_transport"="stop_position"]["tram"="yes"](area.bucuresti);
);
out geom;
`;