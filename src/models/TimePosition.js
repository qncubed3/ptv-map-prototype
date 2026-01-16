import { Position } from "./Position.js";

export class TimePosition {
    constructor({
        position,
        timestamp, 
        received, 
        expiry}
    ){
        this.position = position;
        this.timestamp = timestamp;
        this.received = received;
        this.expiry = expiry;
    }

    static fromJSON(jsonString) {
        return new TimePosition({
            position: new Position(
                jsonString.longitude, 
                jsonString.latitude, 
                jsonString.easting, 
                jsonString.northing,
                jsonString.bearing
            ),
            timestamp: jsonString.datetime_utc,
            received: new Date().toLocaleString("sv-SE").replace(" ", "T"),
            expiry: jsonString.expiry_time,
        })
    }

    clone() {
        return new TimePosition({
            position: this.position.clone(),
            timestamp: this.timestamp,
            received: this.received,
            expiry: this.expiry
        });
    }
    getLonLat() {
        return this.position.getLonLat();
    }
    getExpiry() {
        return this.expiry;
    }
    toString() {
        return `Timestamp: ${this.timestamp.slice(11)}, Received: ${this.received.slice(11)}, Expiry: ${this.expiry.slice(11)} || Coords: ${this.position.getLonLat()}`
    }

}