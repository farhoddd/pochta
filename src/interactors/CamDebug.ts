import { FaceDetection, FaceLandmarks, matchDimensions, createCanvasFromMedia, resizeResults, draw } from 'face-api.js';
import { DetectSize } from '../domains/DetectSize';
import { DocDetection } from './DocDetectionUseCase';
import { videoParam } from '../shared';
export class CamDebug {
    private _debugCanvasElement: HTMLCanvasElement | null = null;
    private readonly _params = { width: videoParam.width, height: videoParam.height };

    private _init(videoElement: HTMLVideoElement): CanvasRenderingContext2D {
        if (this._debugCanvasElement == null) {
            this._debugCanvasElement = createCanvasFromMedia(videoElement);
            videoElement!.parentElement?.append(this._debugCanvasElement);
        }
        const ctx = this._debugCanvasElement.getContext('2d')!;
        return ctx;
    }

    renderDebugRectangles(
        videoElement: HTMLVideoElement,
        detection?: FaceDetection,
        landmark?: FaceLandmarks,
        faceDetectSize?: DetectSize,
        docDetectSize?: DetectSize,
        docDetection?: DocDetection,
    ) {
        const ctx = this._init(videoElement);

        ctx.clearRect(0, 0, this._debugCanvasElement!.width, this._debugCanvasElement!.height);

        if (detection) {
            const dims = matchDimensions(this._debugCanvasElement!, this._params);
            draw.drawDetections(this._debugCanvasElement!, resizeResults(detection, dims));
            console.log('face detection score', detection.score);
        }
        if (landmark) {
            draw.drawFaceLandmarks(this._debugCanvasElement!, landmark)
        }
        if (faceDetectSize) {
            ctx.strokeStyle = 'green';
            ctx.strokeRect(faceDetectSize.opts.x, faceDetectSize.opts.y, faceDetectSize.opts.width, faceDetectSize.opts.height);

            const [outer, inner] = faceDetectSize.sizesWithAllowance;

            ctx.strokeStyle = 'blue';
            ctx.strokeRect(outer.x, outer.y, outer.width, outer.height);

            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(inner.x, inner.y, inner.width, inner.height);
        }
        if (docDetectSize) {
            ctx.strokeStyle = 'green';
            ctx.strokeRect(docDetectSize.opts.x, docDetectSize.opts.y, docDetectSize.opts.width, docDetectSize.opts.height);
            const [outer, inner] = docDetectSize.sizesWithAllowance;
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(outer.x, outer.y, outer.width, outer.height);
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(inner.x, inner.y, inner.width, inner.height);
        }

        if (docDetection) {
            console.log('doc detection score', docDetection.docDetection.score);
            this.renderDocRectangles(videoElement, docDetection.docDetection.box, docDetection.docDetection.score);
            console.log('face detection score', docDetection.faceDetection.score);
            this.renderDocRectangles(videoElement, docDetection.faceDetection.box, docDetection.faceDetection.score, "green");
            console.log('gerb detection score', docDetection.gerbDetection.score);
            this.renderDocRectangles(videoElement, docDetection.gerbDetection.box, docDetection.gerbDetection.score, "yellow");
        }
    }

    renderDocRectangles(videoElement: HTMLVideoElement, box: number[], score: number, color: string = "black") {
        const ctx = this._init(videoElement);
        const imWidth = this._debugCanvasElement!.width;
        const imHeight = this._debugCanvasElement!.height;

        const [ymin, xmin, ymax, xmax] = box;
        const [left, right, top, bottom] = [xmin * imWidth, xmax * imWidth, ymin * imHeight, ymax * imHeight];

        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.font = '32px';
        ctx.fillText(score.toString(), left, top);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.closePath();
        ctx.stroke();
    }
}
