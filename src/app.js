import { initMap } from './map/initMap.js';
import { drawTrainLines, drawStops, drawVehicle } from './map/draw.js';
import { callPTVAPI } from './api/ptvApi.js';
import { Queue } from './models/Queue.js';
import { fetchRuns, fetchRunsLoop} from './api/update.js';
import { TRAIN_LINES, TRAM_LINES } from './config/vehicleLines.js'; 
import { interpolationLoop } from './api/update.js';
import { vehicleInfoPopup, setupSidePanel } from './map/popup.js';

async function main() {

    console.log("Starting");
    const map = await initMap();
    console.log("Map loaded")
    
    console.log("Drawing features")
    const SELECTED_LINES = TRAIN_LINES.map(line => line.code); 
    // const SELECTED_LINES = ['CGE']; 


    let trainList = [];
    let busList = [];

    map.on('load', async () => {
        // await drawTrainLines(map, TRAIN_LINES, SELECTED_LINES)
        // drawStops(map, 'data/railway_stations.geojson', 'train-stations')
        await drawVehicle(map)
        vehicleInfoPopup(map, trainList);
        setupSidePanel(map, trainList);

    });
    // let response = await callPTVAPI("runs", 967031)
    // console.log(response)
    
    console.log("hi")
    await fetchRuns(trainList, TRAIN_LINES.map(line => line.id), 0);
    // await fetchRuns(busList, [786, 789, 825, 850, 854, 855, 867, 869, 870, 935, 937, 939, 946, 950, 952, 954, 959, 960, 961, 964, 970, 971, 972, 974, 975, 977, 979, 980, 982, 999, 1000, 1007, 1013, 1023, 1030, 1143, 1632, 1664, 1665, 1666, 2808, 2813, 2895, 3365, 4663, 4802, 5331, 5334, 5540, 5671, 5675, 5684, 5700, 5704, 5741, 5746, 5747, 5768, 5770, 7440, 7442, 7453, 7455, 7456, 7531, 7627, 7700, 7891, 8074, 8084, 8118, 8122, 8125, 8128, 8135, 8139, 8263, 8306, 8307, 8430, 8457, 8482, 8484, 8487, 8489, 8561, 8564, 8567, 8569, 8570, 8571, 8572, 8582, 8596, 8599, 8611, 8618, 8621, 8630, 8639, 8654, 8765, 8922, 8924, 8934, 10830, 10839, 10842, 10846, 10854, 10917, 10927, 10933, 10937, 10955, 10964, 10967, 10994, 11112, 11118, 11290, 11323, 11366, 11446, 11455, 11457, 11458, 11461, 11462, 11466, 11472, 11473, 11475, 11507, 11510, 11513, 11516, 11519, 11523, 11524, 11525, 11526, 11527, 11528, 11591, 11653, 12739, 12750, 12753, 12766, 12769, 13024, 13025, 13027, 13067, 13107, 13121, 13134, 13135, 13178, 13179, 13263, 13267, 13269, 13270, 13271, 13343, 13352, 13545, 13554, 13623, 13636, 13638, 13640, 13665, 13680, 13686, 13687, 13696, 13697, 13794, 13826, 13828, 13830, 13832, 14922, 14930, 14940, 14941, 14949, 14957, 14993, 14995, 14997, 15009, 15025, 15026, 15061, 15063, 15065, 15067, 15068, 15070, 15086, 15163, 15164, 15165, 15166, 15168, 15169, 15170, 15171, 15172, 15173, 15174, 15175, 15176, 15224, 15227, 15235, 15237, 15239, 15248, 15253, 15260, 15281, 15284, 15288, 15504, 15505, 15506, 15566, 15567, 15603, 15612, 15614, 15616, 15641, 15648, 15650, 15657, 15665, 15667, 15669, 15676, 15680, 15689, 15707, 15730, 15761, 15762, 15782, 15783, 15785, 15789, 15798, 15799, 15800, 15802, 15804, 15806, 15808, 15810, 15813, 15814, 15817, 15821, 15822, 15823, 15824, 15825, 15826, 15827, 15828, 15829, 15830, 15831, 15836, 15838, 15839, 15877, 15886, 15888, 15890, 15892, 15929, 15933, 15935, 15942, 15975, 15976, 15977, 15979, 15992, 16003, 16005, 16006, 16008, 16010, 16019, 16021, 16023, 16029, 16035, 16077, 16079, 16081, 16087, 16089, 16115, 16137, 16139, 16140, 16142, 16197, 16228, 16230, 16234, 16236, 16238, 16269, 16290, 16367, 16372, 16396, 16406, 16440, 16442, 16445, 16447, 16449, 16453, 16482, 16535, 16563, 16590, 16615, 16624, 16633, 16640, 16641, 16642, 16645, 16647, 16648, 16649, 16713, 16714, 16715, 16716, 16723, 16732, 16733, 16734, 16735, 16739, 16740, 16741, 16742, 16743, 17250, 17253, 17254, 17255, 17256, 17257, 17258, 17259, 17260, 17261, 17262, 17263, 17264, 17289, 17290, 17291, 17295, 18900, 18901, 18902, 18903, 18906, 18908, 18909, 18910, 18915, 18917, 18929, 18947, 18958, 18959], 2);
    // await fetchRuns(tramList, TRAM_LINES.map(line => line.id), 1);

    // console.log(busList.toString());
    // console.log(busList.length);
    // updateVehiclePosition(map, trainQueue.heap);
    // updateVehiclePositionLoop(trainQueue);
    fetchRunsLoop(trainList, TRAIN_LINES.map(line => line.id), 0);
    // interpolationLoop(trainQueue);
    animationLoop(map, trainList);
    // animationLoop(map, busList);
    
    // console.log(map.getSource("vehicle-positions"))



}

function updateVehiclePosition(map, vehicleList) {
    
    const source = map.getSource('vehicle-positions');
    if (!source) {
        console.error('Source "vehicle-positions" not found.');
        return;
    }



    const geojson = {
        type: "FeatureCollection",
        features: vehicleList.map(vehicle => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: vehicle.getCurrLonLat()
            },
            properties: {
                color: vehicle.lineColor,
                label: vehicle.lineCode,
                runRef: vehicle.runRef,
                vehicleId: vehicle.vehicleId,
                destName: vehicle.destName
            }
        }))
    }
    map.getSource('vehicle-positions').setData(geojson)
}

async function animationLoop(map, vehicleList) {
    while (true) {
        await updateVehiclePosition(map, vehicleList);
        await sleep(100);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// export function vehicleInfoPopup(map, queue, layerId = "vehicle-layer") {

//     // Create tooltip div
//     const tooltip = document.createElement("div");
//     tooltip.className = "map-tooltip";
//     document.body.appendChild(tooltip);

//     let currentCoords = null;

//     map.on("mousemove", layerId, (e) => {
//         if (!e.features?.length) return;

//         const feature = e.features[0];
//         currentCoords = feature.geometry.coordinates;

//         // Fill tooltip content
//         tooltip.innerHTML = `
//             <strong>${feature.properties.label}</strong><br>
//             Run: ${feature.properties.runRef || "Unknown"}<br>
//             Dest: ${feature.properties.destName || "Unknown"}
//         `;

//         tooltip.classList.add("visible");

//         // Force reflow to get dimensions
//         const rect = tooltip.getBoundingClientRect();
//         const w = rect.width;
//         const h = rect.height;

//         // Project lon/lat → screen pixels
//         const point = map.project(currentCoords);
//         const mapRect = map.getContainer().getBoundingClientRect();
//         const px = mapRect.left + point.x;
//         const py = mapRect.top + point.y;

//         // Simple rule: left-half/right-half of screen
//         const mouseX = e.point.x;
//         const screenMid = window.innerWidth / 2;

//         const circleRadius = 10; // your Mapbox circle radius
//         const gap = 6; // distance between circle and tooltip

//         let left;

//         if (mouseX < screenMid) {
//             // cursor is left → tooltip appears right of circle
//             left = px + circleRadius + gap;
//         } else {
//             // cursor is right → tooltip appears left of circle
//             left = px - (w + circleRadius + gap);
//         }

//         const top = py - h / 2; // vertical centering

//         tooltip.style.left = `${left}px`;
//         tooltip.style.top = `${top}px`;
//     });

//     map.on("mouseleave", layerId, () => {
//         tooltip.classList.remove("visible");
//     });

//     map.on("move", () => {
//         tooltip.classList.remove("visible");
//     });
// }


main();