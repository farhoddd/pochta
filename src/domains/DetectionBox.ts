import { Box } from 'face-api.js';
import { videoParam } from '../shared'
export class DetectionBox {
    constructor(private _x: number, private _y: number, private _width: number, private _height: number) {}

    static fromBox(box: Box): DetectionBox {
        return new this(box.x, box.y, box.width, box.height);
    }

    static fromNumber(box: number[]): DetectionBox {
        const imWidth = videoParam.width;
        const imHeight = videoParam.height;
        const [ymin, xmin, ymax, xmax] = box;
        return new this(xmin * imWidth, ymin * imHeight, (xmax - xmin) * imWidth, (ymax - ymin) * imHeight);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }
    get height(): number {
        return this._height;
    }
}
