import { FaceDetection, FaceExpressions, FaceLandmarks68 } from 'face-api.js';
import { EyeBlink } from './EyeBlink';
import { FrameValidation } from '.';

export class CaptureValidation implements FrameValidation {
    constructor(
        private readonly _threshold: number = 0.8,
        private readonly _exprThreshold: number = 0.8,
        private readonly eyeBlinkFun: EyeBlink = new EyeBlink()
    ) { }

    validate({ detection, expressions, landmarks }: { detection: FaceDetection; expressions: FaceExpressions, landmarks: FaceLandmarks68 }): boolean {
        const result = detection.score > this._threshold && expressions.neutral > this._exprThreshold;
        const blink = this.eyeBlinkFun.isblink(landmarks.getLeftEye()) || this.eyeBlinkFun.isblink(landmarks.getRightEye())
        
        return result && !blink;
    }
}
