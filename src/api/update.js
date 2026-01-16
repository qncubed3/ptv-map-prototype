import { Vehicle } from '../models/Vehicles.js';
import { callPTVAPI } from './ptvApi.js';
import { TimePosition } from '../models/TimePosition.js';

export async function fetchRuns(vehicleList, routeIds, routeType) {
    const failed = []; // store routeIds that fail
    const promises = routeIds.map((id, index) => {
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    const jsonList = await callPTVAPI("positions", routeType, id);
                    addListOfVehicles(vehicleList, jsonList);
                } catch (err) {
                    console.error(`Error fetching route ${id}:`, err);
                    failed.push(id); // add failed route to retry
                }
                resolve();
            }, index * 100); // stagger start
        });
    });

    await Promise.all(promises);

    // Retry failed routes once more
    if (failed.length > 0) {
        console.log(`Retrying failed routes: ${failed.join(", ")}`);
        const retryPromises = failed.map((id, index) => {
            return new Promise(resolve => {
                setTimeout(async () => {
                    try {
                        const jsonList = await callPTVAPI("positions", routeType, id);
                        addListOfVehicles(vehicleList, jsonList);
                        console.log(`Retry success for route ${id}`);
                    } catch (err) {
                        console.error(`Retry failed for route ${id}:`, err);
                    }
                    resolve();
                }, index * 200);
            });
        });
        await Promise.all(retryPromises);
    }
}

function addListOfVehicles(vehicleList, jsonList) {
    // For each in in the list
    jsonList.forEach(run => {
        // Find a vehicle that shares the same vehicle id
        const existingVehicle = vehicleList.find(v => (v.vehicleId === run.vehicle_descriptor.id) && run.vehicle_descriptor.id);
        if (existingVehicle) {
            // If it exists, add the reference 
            existingVehicle.addRunRef(run.run_ref);
            // and also update the position only if its expiry is later than the current expiry
            const newPos = run.vehicle_position;
            if (!newPos) {
                console.warn("PTV returned run but no vehicle_position", runRef);
            } else {
                const timePos = TimePosition.fromJSON(newPos);
                existingVehicle.updatePosition(timePos, true);
            }
            
        } else {
            // Otherwise add as a new vehicle
            vehicleList.push(Vehicle.fromJSON(run));
        }
    });
}

// async function updateExpiredVehicle(runQueue) {
//     // Do nothing if there are no vehicles
//     if (runQueue.heap.length == 0) {
//         return;
//     }

//     // Go through each vehicle in the queue starting at the front
//     for (let i = 0; i < runQueue.size(); i++) {
//         const vehicle = runQueue.heap[i];

//         // Test if vehicle's current position is expired
//         const currentTime = Date.now()
//         const vehicleExpiry = vehicle.getCurrentExpiry()
//         if (vehicleExpiry < currentTime) {

//             // Set the smallest expiry, and search for the largest one
//             let maxExpiry = Date.now();
//             let newTimePos = vehicle.getTimePosData(0);

//             // Go through each run reference of the vehicle
//             for (let runRef of vehicle.runRefs) {

//                 // Get new data for the run ref
//                 const newJson = await callPTVAPI("runs", runRef);
//                 console.log(Date.now() - vehicleExpiry)
//                 // If API failed or returned unexpected structure
//                 if (!newJson || !newJson.runs || newJson.runs.length === 0) {
//                     console.warn("PTV returned empty run data for", runRef, newJson);
//                     continue;
//                 }

//                 const newPos = newJson.runs[0].vehicle_position;

//                 if (!newPos) {
//                     console.warn("PTV returned run but no vehicle_position", runRef);
//                     continue;
//                 }

//                 // Check if new position data expires later than the current best one
//                 const timePos = TimePosition.fromJSON(newPos);

//                 if (new Date(timePos.getExpiry()).getTime() > maxExpiry) {
//                     maxExpiry = timePos.getExpiry();
//                     newTimePos = timePos;
//                 }
//             }

//             // Update vehicle with the new position and update the vehicle queue
//             vehicle.updatePosition(newTimePos);
//             runQueue.heap.sort();
//         } else {
//             break;
//         }
//     }
// }

// export async function updateVehiclePositionLoop(runQueue) {
//     while (true) {
//         await updateExpiredVehicle(runQueue);
//         await sleep(1000);
//     }
// }

export async function fetchRunsLoop(vehicleList, routeIds, routeType) {
    while (true) {
        await fetchRuns(vehicleList, routeIds, routeType)
        await sleep(5000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function interpolateVehiclePosition(vehicle) {
    if (!vehicle.getTimePosData(0)) {
        return;
    }
    const currentTime = Date.now();
    const currPosExpiry = new Date(vehicle.getCurrentExpiry()).getTime();
    const currPosReceived = new Date(vehicle.getCurrentReceived()).getTime();
    let timeProp = 0;
    if (!(currPosExpiry === currPosReceived)) {
        timeProp = (currentTime - currPosReceived) / (currPosExpiry - currPosReceived);
    }
    if (timeProp < 0) timeProp = 0;
    if (timeProp > 1) timeProp = 1;
    const currLonLat = vehicle.getCurrLonLat();
    const prevLonLat = vehicle.getPrevLonLat();
    const dispLonLat = vectorAdd(vectorScale(1 - timeProp, prevLonLat), vectorScale(timeProp, currLonLat));
    if (vehicle.runRefs.includes("967497")) {
        // console.log(currLonLat, prevLonLat, (currentTime - currPosReceived) / (currPosExpiry - currPosReceived) , dispLonLat);
    }
    vehicle.setDispLonLat(dispLonLat);
}

export async function interpolationLoop(vehicleList) {
    
    while (true) {
        for (let vehicle of vehicleList) {
            interpolateVehiclePosition(vehicle);
            
            
        }
        await sleep(50);
    }
}

function vectorAdd(a, b) {
    return [a[0]+b[0], a[1]+b[1]];
}

function vectorScale(k, a) {
    return [k * a[0], k * a[1]];
}