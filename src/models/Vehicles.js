import { Position } from '../models/Position.js';
import { TimePosition } from '../models/TimePosition.js';
import { TRAIN_LINES } from '../config/vehicleLines.js';
import { LINE_COLORS } from '../config/colors.js';

export class Vehicle {
    constructor({
        runRef,
        routeId,
        vehicleId,
        routeType,
        destName,
        dirId,
        timePosData,
        dispPos
    }) {
        if (!timePosData.every(timePos => timePos instanceof TimePosition)) {
            throw new TypeError("timePosData must be an array of TimePosition")
        }

        if (dispPos != null && !(dispPos instanceof Position)) {
            throw new TypeError("dispPos must be a Position instance");
        }

        // Basic info
        this.runRefs = [runRef];
        this.routeId = routeId;
        this.vehicleId = vehicleId;
        this.routeType = routeType;
        this.destName = destName;
        this.dirId = dirId;
        this.timePosData = timePosData;
        this.dispPos = dispPos;

        // Line info
        if (routeType == 0) {
            const trainLine = TRAIN_LINES.find(line => line.id === this.routeId.toString());
            this.lineName  = trainLine ? trainLine.name  : 'None';
            this.lineCode  = trainLine ? trainLine.code  : 'None';
            this.lineColor = trainLine ? trainLine.color : 'rgba(0, 0, 0, 1)';
        } else if (routeType == 2) {
            this.lineColor = LINE_COLORS.ORANGE;
            this.lineCode = "BUS";
            this.lineName = "BUS";
        }
    }


    static fromJSON(jsonData) {
        const currentPos = TimePosition.fromJSON(jsonData.vehicle_position);
        return new Vehicle({
            runRef: jsonData.run_ref,
            routeId: jsonData.route_id,
            vehicleId: jsonData.vehicle_descriptor.id,
            routeType: jsonData.route_type,
            destName: jsonData.destination_name,
            dirId: jsonData.direction_id,
            timePosData: [currentPos, currentPos.clone()],
            dispPos: currentPos.position
        });
    }

    getCurrLonLat() {
        return this.timePosData.at(-1).getLonLat();
    }

    getPrevLonLat() {
        if (this.timePosData.length == 1) {
            return this.timePosData.at(0).getLonLat()
        } else {
            return this.timePosData.at(-2).getLonLat();
        }   
    }

    getDispLonLat() {
        if (!this.dispPos) {
            console.log("BRUH");
            
            return this.timePosData(-1).getLonLat();
        }
        return this.dispPos.getLonLat();
    }

    setDispLonLat(lonLatArray) {
        if (!this.dispPos) {
            this.dispPos = Position.fromLonLat(lonLatArray);
        }
        this.dispPos.setLonLat(lonLatArray);
    }

    getTimePosData(offset=null) {
        if (offset === null) {
            return this.timePosData;
        } else {
            return this.timePosData.at(-(offset+1));
        }
    }


    async update() {
        response = await callPTVAPI("runs", this.runRef)
    }

    addRunRef(runRef) {
        if (!this.runRefs.includes(runRef)) {
            this.runRefs.push(runRef);
        }
    }

    updatePosition(newPos, enforceLaterTime=false) {
        if (!(newPos instanceof TimePosition)) {
            throw new TypeError("newPos must be a Position instance");
            return;
        }
        if (newPos.expiry === this.timePosData.at(-1).expiry) {
            return;
        }
        if (enforceLaterTime && this.getCurrentExpiry() > new Date(newPos.expiry).getTime()) {
            return;
        }
        this.timePosData.push(newPos);
        this.lastUpdateTimestamp = Date.now();
    }

    getCurrentExpiry(offset=0) {
        return new Date(this.timePosData.at(-(offset+1)).expiry).getTime()
        
    }

    getCurrentReceived(offset=0) {
        return new Date(this.timePosData.at(-(offset+1)).received).getTime()
        
    }

    info() {
        console.log(
            `Vehicle ${this.runRef} at ${this.currPos.toString()} `
            + `(updated ${new Date(this.lastUpdateTimestamp).toLocaleTimeString()})`
        );
    }

    toString() {
        return `\n${this.runRefs},\n-- ${this.timePosData.at(-1).expiry}, ${this.timePosData.at(-1).position.longitude}, ${this.timePosData.at(-1).position.latitude}\n` ;
    }
    toPosDataHTML() {
        let dataString = "";
        for (let i=0; i<this.timePosData.length; i++) {
            dataString = dataString + `<p>${i} | ${this.timePosData[i].toString()}</p>`
        }
        return dataString;
    }
}