export function stationInfoPopup(map, stationList) {

}

export function vehicleInfoPopup(map, vehicleList) {
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on("mouseenter", "vehicle-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];
        const mapWidth = map.getCanvas().clientWidth;

        // If cursor is on left half → popup appears to the right
        // If cursor is on right half → popup appears to the left
        const offset = {
            left: [20, 0],
            right: [-20, 0],
            top: [0, 20],
            bottom: [0, -20]
        };
        
        console.log(feature.properties.color);
        popup
        .setLngLat(feature.geometry.coordinates)
        .setHTML(`
            <div class="popup-container">
                <div class="popup-header" style="background-color: ${feature.properties.color} !important;">
                    <b>${feature.properties.label}</b> | ${feature.properties.from || "Unknown"} → ${feature.properties.to || "Unknown"}
                </div>
                <div class="popup-body">
                Line: ${feature.properties.label}<br>
                Dest: ${feature.properties.destName || "Unknown"}<br>
                Ref: ${feature.properties.runRef || "Unknown"}<br>
                VID: ${feature.properties.vehicleId || "Unknown"}<br>
                Extra info here
                </div>
            </div>
        `)
        .addTo(map);
    });

    map.on("mouseleave", "vehicle-layer", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });
    map.on("mousemove", "vehicle-layer", (e) => {
        // Keep the popup anchored to the circle as you move the mouse
        const feature = e.features[0];
        popup.setLngLat(feature.geometry.coordinates);
    });
    
}

export function setupSidePanel(map, vehicleList) {
    const panel = document.getElementById("side-panel");
    const panelContent = document.getElementById("panel-content");
    const closeBtn = document.getElementById("close-panel");

    closeBtn.addEventListener("click", () => {
        panel.classList.remove("open");
    });

    map.on("click", "vehicle-layer", (e) => {
        const feature = e.features[0];
        const posDataHTML = vehicleList.find(v=>v.vehicleId === feature.properties.vehicleId)?.toPosDataHTML();
        // Fill panel with info
        panelContent.innerHTML = `
        <h2>${feature.properties.label}</h2>
        <p><strong>Line:</strong> ${feature.properties.line || "Unknown"}</p>
        <p><strong>Destination:</strong> ${feature.properties.dest || "Unknown"}</p>
        <p><strong>Status:</strong> ${feature.properties.status || "Unknown"}</p>
        <p><strong>Last updated:</strong> ${feature.properties.time || "Unknown"}</p>
        `+posDataHTML;

        // Slide panel in
        panel.classList.add("open");
    });
}


