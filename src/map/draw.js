export async function drawTrainLines(map, trainLines, selectedLines) {
    const lines = trainLines.filter(line => selectedLines.includes(line.code));

    return Promise.all(
        lines.map(async (line) => {
            try {
                const response = await fetch(`data/train_lines/${line.code}.geojson`);
                
                if (!response.ok) {
                    console.warn(`GeoJSON not found for line ${line.code} (status ${response.status})`);
                    return null; // skip this line
                }

                const geojson = await response.json();

                map.addSource(line.code, {
                    type: 'geojson',
                    data: geojson
                });

                map.addLayer({
                    id: line.code,
                    type: 'line',
                    source: line.code,
                    paint: {
                        'line-color': line.color,
                        'line-width': 5
                    }
                });

                return { geojson, line };
            } catch (err) {
                console.error(`Error loading line ${line.code}:`, err);
                return null; // skip this line on error
            }
        })
    );
}


export async function drawStops(map, data, id = "stops", iconUrl = "../assets/train_stop.png") {
    // Load train stop icon
    if (!map.hasImage(id)) {
        const img = await new Promise((resolve, reject) => {
            map.loadImage(iconUrl, (error, image) => {
                if (error) reject(error);
                else resolve(image);
            });
        });
        map.addImage(id, img);
    }

    // 2️⃣ Add the source for stops
    map.addSource(id, {
        type: "geojson",
        data: data
    });

    // 3️⃣ Add a symbol layer using the loaded PNG
    map.addLayer({
        id: `${id}-layer`,
        type: "symbol",
        source: id,
        layout: {
            "icon-image": id,   // uses the image we loaded
            "icon-size": [
                'interpolate',
                ['linear'],
                ['zoom'],
                12, 0.05,   // zoom level → icon size
                30, 0.5
            ],
            "icon-allow-overlap": true // avoid hiding nearby icons
        },
            paint: {
                "icon-opacity": [
                'interpolate',
                ['linear'],
                ['zoom'],
                11.5, 0,   // invisible just before 12
                12.0, 1.0    // fully visible
            ],
        },
        minzoom: 11.5
    });
}

export async function drawVehicle(map, id="vehicle") {
    map.addSource(`${id}-positions`, {
        type: 'geojson',
        data: {
            type: "FeatureCollection",
            features: []
        }
    })

    map.addLayer({
        id: `${id}-layer`,
        type: 'circle',
        source: `${id}-positions`,
        paint: {
            'circle-radius': 15,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    })

    map.addLayer({
        id: `${id}-label-layer`,
        type: 'symbol',
        source: `${id}-positions`,
                layout: {
            'text-field': ['get', 'label'],   // ← text from feature
            'text-size': 12,
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-offset': [0, 0], // push text slightly below or above
            'text-allow-overlap': true,      // ← prevent disappearing
            // 'text-ignore-placement': true    // ← ignore collisions
        },
        paint: {
            'text-color': 'white'
        }
    })
}