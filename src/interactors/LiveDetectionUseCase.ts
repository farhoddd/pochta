
import { detectSingleFace, resizeResults, SsdMobilenetv1Options } from 'face-api.js';
import { DetectSize } from '../domains/DetectSize';
import { DetectionBox } from '../domains/DetectionBox';
import { Nullable } from '../shared/typings';
import { FrameValidation, ValidationState } from '../validation';
import { CamDebug } from './CamDebug';
import { videoParam } from './../shared';
import { REACT_APP_DEBUG } from '../consts';

export class LiveDetectionUseCase {
    private _detecting = false;
    private _reqId = 0;
    private _camDebug: Nullable<CamDebug> = null;
    private _state: ValidationState;

    constructor(private readonly _detectSize: DetectSize) {
        this._state = ValidationState.getInstance()
        if (REACT_APP_DEBUG === 'true') {
            this._camDebug = new CamDebug();
        }
    }

    execute(videoElement: HTMLVideoElement, validations: FrameValidation[], cb: (faceBox: DetectionBox) => void) {
        const ssdMobilenetv1Options = new SsdMobilenetv1Options();

        this._detecting = true;

        console.log('LiveDetectionUseCase');
        const doDetect = async () => {

            console.log('doDetect');
            if (this._detecting) {

                const originResult = await detectSingleFace(videoElement, ssdMobilenetv1Options).withFaceLandmarks(true).withFaceExpressions()

                if (originResult) {
                    const resizedResult = resizeResults(originResult, videoParam)
                    const { detection, expressions, unshiftedLandmarks } = resizedResult

                    const isValid = validations.map((v) => v.validate({ detection, expressions, landmarks: unshiftedLandmarks }))
                        .reduce((l, r) => l && r);
                    if (this._camDebug) {
                        console.log(originResult)
                        this._camDebug.renderDebugRectangles(videoElement, detection, unshiftedLandmarks, this._detectSize);
                        console.log(this._state)
                    }
                    if (isValid) {
                        this.abort();
                        cb(DetectionBox.fromBox(originResult.detection.box));
                    }
                } else {
                    this._state.clean()
                }

                this._reqId = window.requestAnimationFrame(doDetect);
            } else {
                this.abort();
            }
        };
        doDetect();
    }

    abort() {
        this._detecting = false;

        do {
            cancelAnimationFrame(this._reqId);
            this._reqId = 0;
        } while (this._reqId !== 0);
    }
}
