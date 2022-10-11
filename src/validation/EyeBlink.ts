import { Point, euclideanDistance } from 'face-api.js';

export class EyeBlink {

    isblink(points: Point[]) {
        const a = euclideanDistance([points[1].x, points[1].y], [points[5].x, points[5].y])
        const b = euclideanDistance([points[2].x, points[2].y], [points[4].x, points[4].y])
        const c = euclideanDistance([points[0].x, points[0].y], [points[3].x, points[3].y])
        const ear = (a + b) / (2.0 * c) // 0.3 > open
        return ear <= 0.3
    }

}
