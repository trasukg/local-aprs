import { Util } from './util';
import { GpsPoint } from './gpsPoint';
import * as wgs84 from 'wgs84';

export class Haversine {
    private origin: GpsPoint;
    private R: number;
    constructor(origin: GpsPoint) {
        this.R = wgs84.RADIUS;
        this.origin = origin;
    }

    /**
     * Get the distance of the next point relative to the origin
     * @param origin the origin gps coordinate
     * @param next next gps coordinate
     * @returns distance in meter (m)
     */
    static getDistance(origin: GpsPoint, next: GpsPoint): number {
        const haversine = new Haversine(origin);

        return haversine.getDistance(next);
    }

    /**
     * Get the bearing of the next point relative to the origin
     * @param origin the origin gps coordinate
     * @param next next gps coordinate
     * @returns bearing in degree (deg)
     */
    static getBearing(origin: GpsPoint, next: GpsPoint): number {
        const haversine = new Haversine(origin);

        return haversine.getBearing(next);
    }

    /**
     * Get the next gps coordinate position relative to the origin
     * @param origin the origin gps coordinate
     * @param next the next gps coordinate
     * @returns [x, y] in meter (m) relative to the origin
     */
    static getPosition(origin: GpsPoint, next: GpsPoint): number {
        const haversine = new Haversine(origin);

        return haversine.getPosition(next);
    }

    /**
     * Get the next gps coordinate position relative to the origin
     * @param next the next gps coordinate
     * @returns [x, y] in meter (m) relative to the origin
     */
    getPosition(next: GpsPoint): any {
        const distance = this.getDistance(next);
        const bearing = this.getBearing(next);

        const x = distance * Math.sin(Util.toRadian(bearing));
        const y = distance * Math.cos(Util.toRadian(bearing));

        return [x, y];
    }

    /**
     * Get the distance of the next point relative to the origin
     * @param next next gps coordinate
     * @returns distance in meter (m)
     */
    getDistance(next: GpsPoint): number {
        const dLat = Util.toRadian(next.lat - this.origin.lat);
        const dLong = Util.toRadian(next.lng - this.origin.lng);

        const lat1 = Util.toRadian(this.origin.lat);
        const lat2 = Util.toRadian(next.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLong / 2) * Math.sin(dLong / 2) * Math.cos(lat1) * Math.cos(lat2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return this.R * c;
    }

    /**
     * Get the bearing of the next point relative to the origin
     * @param next next gps coordinate
     * @returns bearing in degree (deg)
     */
    getBearing(next: GpsPoint): number {
        const lat1 = Util.toRadian(this.origin.lat);
        const lat2 = Util.toRadian(next.lat);

        const long1 = Util.toRadian(this.origin.lng);
        const long2 = Util.toRadian(next.lng);


        const y = Math.sin(long2 - long1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1);

        return (Util.toDegree(Math.atan2(y, x)) + 360) % 360;
    }
}
