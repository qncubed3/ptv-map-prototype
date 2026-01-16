import { MAP_CONFIG } from '../config/map.js';

export function initMap() {
    mapboxgl.accessToken = MAP_CONFIG.accessToken;
    const map = new mapboxgl.Map(MAP_CONFIG);
    return map;
}