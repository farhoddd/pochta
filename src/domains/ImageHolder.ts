import { CapturedImage } from './CapturedImage';
export class ImageHolder {
    private _faceImage = new CapturedImage('', '');
  
    private _documentImage = new CapturedImage('', '');

    get faceImage() {
        return this._faceImage;
    }

    set faceImage(image: CapturedImage) {
        this._faceImage = image;
    }

    get documentImage() {
        return this._documentImage;
    }

    set documentImage(image: CapturedImage) {
        this._documentImage = image;
    }

    private static _instance = new ImageHolder();

    static getInstance() {
        if (ImageHolder._instance == null) {
            ImageHolder._instance = new ImageHolder();
        }

        return ImageHolder._instance;
    }
}
