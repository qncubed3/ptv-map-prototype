export class Position {

    constructor(longitude, latitude, easting, northing, bearing) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.easting = easting;
        this.northing = northing;
        this.bearing = bearing;
    }

    update(longitude, latitude, easting, northing, bearing) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.easting = easting;
        this.northing = northing;
        this.bearing = bearing;
    }
    getLonLat() {
        if (!this.longitude || !this.latitude) {
            return null;
        }
        return [this.longitude, this.latitude];
    }

    setLonLat(lonLatArray) {
        this.longitude = lonLatArray[0];
        this.latitude = lonLatArray[1];
        this.easting = null;
        this.northing = null;
        this.bearing = null;
    }
    clone() {
        return new Position(
            this.longitude,
            this.latitude,
            this.easting,
            this.northing,
            this.bearing
        );
    }

    static fromLonLat(lonLatArray) {
        return new Position(lonLatArray[0], lonLatArray[1], null, null, null);
    }
}