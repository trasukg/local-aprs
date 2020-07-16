export class Util {
    /**
     * Convert degree to radian
     * @param degree degree
     */
    static toRadian(degree: number): number {
        return degree * Math.PI / 180;
    }

    /**
     * Convert radian to degree
     * @param radian radian
     */
    static toDegree(radian: number): number {
        return radian * 180 / Math.PI;
    }
}
