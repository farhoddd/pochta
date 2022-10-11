import { Base64Image, CapturedImage } from '../domains/CapturedImage';
import { DetectionBox } from '../domains/DetectionBox';
import { REACT_APP_DEBUG } from '../consts';

export class CaptureImageUseCase {
    constructor(private _document: Document) { }

    execute(videoElement: HTMLVideoElement | HTMLInputElement, coords?: DetectionBox): CapturedImage {
        const preview = this.capture(videoElement, coords);
        const fullframe = this.capture(videoElement);

        const documentModel = new CapturedImage(fullframe, preview);
        if (REACT_APP_DEBUG === 'true') {
            console.log(documentModel)
        }
        return documentModel;
    }

    private capture(videoElement: any, coords?: DetectionBox): Base64Image {
        const canvasElement = this._document.createElement('canvas');

        if (coords) {
            canvasElement.width = coords.width;
            canvasElement.height = coords.height;
            const canvasContext = canvasElement.getContext('2d')!;

            canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

            canvasContext.drawImage(
                videoElement,
                coords.x,
                coords.y,
                coords.width,
                coords.height,
                0,
                0,
                coords.width,
                coords.height
            );

        } else {
            canvasElement.width = videoElement.offsetWidth;
            canvasElement.height = videoElement.offsetHeight;
            const canvasContext = canvasElement.getContext('2d')!;
            canvasContext.drawImage(videoElement, 0, 0, videoElement.offsetWidth, videoElement.offsetHeight);
        }
        
        const dataUrl = canvasElement.toDataURL('image/png');
        return dataUrl;
    }
}
