export type Base64Image = string;

export class CapturedImage {
    constructor(private _fullframe: Base64Image, private _preview: Base64Image) {}

    get fullframe(): Base64Image {
        return this._fullframe;
    }

    get preview(): Base64Image {
        return this._preview;
    }
}
